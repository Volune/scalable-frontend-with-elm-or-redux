import React, { Children, Component, PropTypes } from 'react';
import Provider from './Provider';

const DEFAULT_MERGE_PROPS = (stateProps, messageProps, ownProps, engine) =>
  (Object.assign({ engine }, ownProps, stateProps, messageProps));

const DEFAULT_MERGE_DEPENDENCIES = (providedDependencies, contextProps) =>
  (Object.assign({}, providedDependencies, contextProps));

const DEFAULT_FACTORY = () => (undefined);
const DEFAULT_ENGINE_FACTORY = (propsEngine, contextEngine, options) =>
  ((propsEngine || contextEngine).scope(options));

const RETURN_NO_PROPS = () => ({});
const RETURN_NO_DEPENDENCIES = () => ({});

const getDisplayName = (WrappedComponent) =>
  (WrappedComponent.displayName || WrappedComponent.name || 'Component');

const engineType = PropTypes.object;

export default function component({
  mapStateToProps = RETURN_NO_PROPS,
  mapMessagesToProps = RETURN_NO_PROPS,
  provideDependencies = RETURN_NO_DEPENDENCIES,
  mapContextToDependencies = RETURN_NO_DEPENDENCIES,
  transformer = undefined,
  transformerFactory = DEFAULT_FACTORY,
  consumer = undefined,
  consumerFactory = DEFAULT_FACTORY,
  reducer = undefined,
  reducerFactory = DEFAULT_FACTORY,
  mergeProps = DEFAULT_MERGE_PROPS,
  mergeDependencies = DEFAULT_MERGE_DEPENDENCIES,
  engineFactory = DEFAULT_ENGINE_FACTORY,
  disableProvideEngineInContext = false,
}) {
  return (WrappedComponent) => {
    class AssembledComponent extends Component {
      constructor(props, context) {
        super(props, context);
        const engine = engineFactory(props.engine, context.engine, {
          transformer: transformer || transformerFactory(),
          consumer: consumer || consumerFactory(),
          reducer: reducer || reducerFactory(),
          getDependencies: this.getDependencies,
          getProps: this.getProps,
        });
        this.engine = engine;

        this.messageProps = Object.entries(mapMessagesToProps()).reduce(
          (propsFromMessages, [key, message]) => Object.assign(propsFromMessages, {
            [key]: Array.isArray(message)
              ? () => engine.dispatch(...message)
              : () => engine.dispatch(message),
          }),
          {}
        );
        const state = this.engine.getState();
        const stateProps = mapStateToProps(state, props);
        this.state = mergeProps(stateProps, this.messageProps, props, this.engine);

        this.providedDependencies = provideDependencies();
        const contextDependencies = mapContextToDependencies(context);
        this.dependencies = mergeDependencies(this.providedDependencies, contextDependencies);
      }

      getChildContext() {
        if (disableProvideEngineInContext) {
          return {
            engine: this.context ? this.context.engine : undefined,
          };
        }
        return {
          engine: this.engine,
        };
      }

      componentDidMount() {
        this.subscription = this.engine.subscribe(this.updatePropsFromState);
      }

      componentWillReceiveProps(newProps, newContext) {
        if (this.props !== newProps) {
          const state = this.engine.getState();
          const stateProps = mapStateToProps(state, newProps);
          this.setState(mergeProps(stateProps, this.messageProps, newProps, this.engine));
        }
        if (this.context !== newContext) {
          const contextDependencies = mapContextToDependencies(newContext);
          this.dependencies = mergeDependencies(this.providedDependencies, contextDependencies);
        }
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      getDependencies = () => (this.dependencies);

      getProps = () => (this.state);

      updatePropsFromState = () => {
        const state = this.engine.getState();
        const stateProps = mapStateToProps(state, this.props);
        this.setState(mergeProps(stateProps, this.messageProps, this.props, this.engine));
      };

      render() {
        const mergedProps = this.state;
        const { children, ...otherMergedProps } = mergedProps;
        if (!disableProvideEngineInContext && Children.count(children) > 0) {
          return (<WrappedComponent {...otherMergedProps}>
            <Provider engine={this.context.engine}>{children}</Provider>
          </WrappedComponent>);
        }
        return (<WrappedComponent {...mergedProps} />);
      }
    }

    AssembledComponent.displayName = `AssembledComponent(${getDisplayName(WrappedComponent)})`;
    AssembledComponent.propTypes = engineType;
    AssembledComponent.contextTypes = engineType;
    AssembledComponent.childContextTypes = engineType;

    return AssembledComponent;
  };
}
