import React, { Component } from 'react';
import { engineType } from './propTypes';
import { ensureIsFunction } from './helpers';

const DEFAULT_MERGE_PROPS = (stateProps, messageProps, ownProps, engine) =>
  (Object.assign({ engine }, ownProps, stateProps, messageProps));

const RETURN_NO_PROPS = () => ({});

const getDisplayName = (WrappedComponent) =>
  (WrappedComponent.displayName || WrappedComponent.name || 'Component');

export default function component({
  mapStateToProps = RETURN_NO_PROPS,
  mapEventsToProps = RETURN_NO_PROPS,
  mergeProps = DEFAULT_MERGE_PROPS,
}) {
  ensureIsFunction(mapStateToProps, 'mapStateToProps');
  ensureIsFunction(mapEventsToProps, 'mapEventsToProps');

  return (WrappedComponent) => {
    class ConnectedComponent extends Component {
      constructor(props, context) {
        super(props, context);
        this.engine = props.engine || context.engine;

        this.messageProps = Object.entries(mapEventsToProps()).reduce(
          (propsFromMessages, [key, type]) =>
            Object.assign(propsFromMessages, {
              [key]: (...args) => this.engine.dispatch({
                type,
                args,
                getEmitterProps: this.getProps,
              }),
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

      componentWillReceiveProps(newProps) {
        if (this.props !== newProps) {
          const state = this.engine.getState();
          const stateProps = mapStateToProps(state, newProps);
          this.setState(mergeProps(stateProps, this.messageProps, newProps, this.engine));
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
        this.subscription = null;
      }

      getProps = () => this.props;

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
    ConnectedComponent.propTypes = {
      ...(WrappedComponent.propTypes || {}),
      engine: engineType,
    };
    ConnectedComponent.contextTypes = {
      ...(WrappedComponent.contextTypes || {}),
      engine: engineType,
    };

    return ConnectedComponent;
  };
}
