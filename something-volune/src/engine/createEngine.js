import { INIT, CHANGE } from './messages';

const EMPTY_PROPS = {};
const EMPTY_DEPENDENCIES = {};

// Default transformer doesn't dispatch other messages, doesn't prevent default
const DEFAULT_TRANSFORMER = () => false;
// Default consumer does nothing
const DEFAULT_CONSUMER = () => undefined;
// Default reducer returns default state undefined and ignore messages
const DEFAULT_REDUCER = (state = undefined) => state;

const DEFAULT_GET_PROPS = () => EMPTY_PROPS;
const DEFAULT_GET_DEPENDENCIES = () => EMPTY_DEPENDENCIES;

// Default rethrow errors
const DEFAULT_HANDLE_ERROR = error => {
  throw error;
};

// Default assume state is already serializable
const DEFAULT_COMPUTE_SERIALIZABLE_STATE = state => state;

const SCOPE_KEY_PREFIX = '@@ENGINE_SCOPE__GENERATED__';

export default function createEngine({
  transformer = DEFAULT_TRANSFORMER,
  consumer = DEFAULT_CONSUMER,
  reducer = DEFAULT_REDUCER,
  initialState = undefined,
  getProps = DEFAULT_GET_PROPS,
  getDependencies = DEFAULT_GET_DEPENDENCIES,
  computeSerializableState = DEFAULT_COMPUTE_SERIALIZABLE_STATE,
  handleError = DEFAULT_HANDLE_ERROR,
}) {
  const engine = {};
  const listenersMap = {};
  let listenersList = null;
  let listenerKeyGenerator = 1;
  let scopeKeyGenerator = 1;
  let state = initialState;
  const scopes = {};

  let dispatching = false;

  const callListeners = (oldState, newState) => {
    if (!listenersList) {
      listenersList = Object.values(listenersMap);
    }
    listenersList.forEach(listener => listener(oldState, newState));
  };

  const handleMessage = ([message, ...args]) => {
    const emittedMessaged = [];

    try {
      const defaultPrevented = transformer(message, {
        args,
        dispatch: (...consecutiveMessageAndArgs) => {
          emittedMessaged.push(consecutiveMessageAndArgs);
        },
        getState: engine.getState,
        getProps,
      });

      if (!defaultPrevented) {
        consumer(message, {
          args,
          getState: engine.getState,
          getProps,
          getDependencies,
        });

        const oldState = state;
        state = reducer(state, message, {
          args,
          getProps,
        });

        if (state !== oldState) {
          emittedMessaged.unshift([CHANGE, oldState, state]);

          callListeners(oldState, state);
        }
      }
    } catch (error) {
      handleError(error);
    }

    return emittedMessaged;
  };

  const dispatch = (...messageAndArgs) => {
    if (dispatching) {
      throw new Error('Trying to dispatch external event while already dispatching');
    }

    dispatching = true;
    try {
      const consecutiveMessages = handleMessage(messageAndArgs);
      while (consecutiveMessages.length > 0) {
        const consecutiveMessageAndArgs = consecutiveMessages.shift();
        const moreConsecutiveMessages = handleMessage(consecutiveMessageAndArgs);
        if (moreConsecutiveMessages.length > 0) {
          consecutiveMessages.unshift(...moreConsecutiveMessages);
        }
      }
    } finally {
      dispatching = false;
    }
  };

  const getState = () => state;
  const getSerializableStateAndScopes = () => ({
    state: computeSerializableState(state),
    scopes: Object.entries(scopes).reduce(
      (serializableScopes, [key, scopedEngine]) =>
        Object.assign(serializableScopes, {
          [key]: scopedEngine.getSerializableStateAndScopes(),
        }),
      {} // init serializableScopes
    ),
  });

  const subscribe = listener => {
    const listenerKey = String(listenerKeyGenerator++);
    const subscription = {
      unsubscribe() {
        delete listenersMap[listenersMap];
        listenersList = null; // force refresh on next trigger
      },
    };
    listenersMap[listenerKey] = listener;
    listenersList = null; // force refresh on next trigger
    return subscription;
  };

  const scope = ({
    key = undefined,
    ...engineOptions,
  }) => {
    const scopeKey = key !== undefined ? key : SCOPE_KEY_PREFIX + String(scopeKeyGenerator++);
    const scopedEngine = {
      ...createEngine({
        ...engineOptions,
      }),
      destroy: () => {
        delete scopes[scopeKey];
      },
    };
    scopes[scopeKey] = scopedEngine;
    return scopedEngine;
  };

  Object.assign(engine, {
    dispatch,
    getState,
    getSerializableStateAndScopes,
    subscribe,
    scope,
  });

  dispatch(INIT);

  return engine;
}
