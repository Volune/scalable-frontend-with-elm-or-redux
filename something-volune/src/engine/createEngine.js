import EVENTS from './events';

const EMPTY_PROPS = {};
const EMPTY_DEPENDENCIES = {};

// Default transform doesn't dispatch other messages, doesn't prevent default
const DEFAULT_TRANSFORM = event => [event];
// Default consumer does nothing
const DEFAULT_CONSUME = () => undefined;
// Default reduce returns default state undefined and ignore messages
const DEFAULT_REDUCE = (state = undefined) => state;

const DEFAULT_GET_PROPS = () => EMPTY_PROPS;
const DEFAULT_GET_DEPENDENCIES = () => EMPTY_DEPENDENCIES;

export default function createEngine({
  transform = DEFAULT_TRANSFORM,
  consume = DEFAULT_CONSUME,
  reduce = DEFAULT_REDUCE,
  initialState = undefined,
  getApiProps = DEFAULT_GET_PROPS,
  getDependencies = DEFAULT_GET_DEPENDENCIES,
}) {
  const engine = {};
  const listenersMap = {};
  let listenersList = null;
  let listenerKeyGenerator = 1;
  let state = initialState;

  let dispatching = false;

  const callListeners = (oldState, newState) => {
    if (!listenersList) {
      listenersList = Object.values(listenersMap);
    }
    listenersList.forEach(listener => listener(oldState, newState));
  };

  const getState = () => state;

  const dispatch = (event) => {
    if (dispatching) {
      throw new Error('Trying to dispatch external event while already dispatching');
    }

    dispatching = true;
    try {
      const oldState = state;

      const messages = transform(event, {
        getState,
        getApiProps,
      });
      for (const message of messages) {
        consume(message, {
          getDependencies,
          getState,
          getApiProps,
          dispatch,
        });
        state = reduce(state, message, {
          getApiProps,
        });
      }

      if (state !== oldState) {
        consume({
          type: EVENTS.CHANGE,
          oldState,
          newState: state,
        });

        callListeners(oldState, state);
      }
    } finally {
      dispatching = false;
    }
  };

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

  Object.assign(engine, {
    dispatch,
    getState,
    subscribe,
  });

  dispatch({
    type: EVENTS.INIT,
  });

  return engine;
}
