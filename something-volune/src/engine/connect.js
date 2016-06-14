import React, { Component, PropTypes } from 'react';

const DEFAULT_MERGE_PROPS = (stateProps, messageProps, ownProps, engine) =>
  (Object.assign({ engine }, ownProps, stateProps, messageProps));

const RETURN_NO_PROPS = () => ({});

const getDisplayName = (WrappedComponent) =>
  (WrappedComponent.displayName || WrappedComponent.name || 'Component');

const engineType = PropTypes.object;

export default function component({
  mapStateToProps = RETURN_NO_PROPS,
  mapMessagesToProps = RETURN_NO_PROPS,
  mergeProps = DEFAULT_MERGE_PROPS,
}) {
  return (WrappedComponent) => {
    class ConnectedComponent extends Component {
      constructor(props, context) {
        super(props, context);
        const engine = props.engine|| context.engine;
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
        return (<WrappedComponent {...mergedProps} />);
      }
    }

    ConnectedComponent.displayName = `ConnectedComponent(${getDisplayName(WrappedComponent)})`;
    ConnectedComponent.propTypes = engineType;
    ConnectedComponent.contextTypes = engineType;

    return ConnectedComponent;
  };
}
