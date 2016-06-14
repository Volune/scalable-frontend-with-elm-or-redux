import React, { Component, PropTypes } from 'react';

export default class Provider extends Component {
  getChildContext() {
    return {
      engine: this.props.engine,
    };
  }

  render() {
    return (<div>{this.props.children}</div>);
  }
}

Provider.propTypes = {
  children: PropTypes.node,
  engine: PropTypes.object,
};

Provider.childContextTypes = {
  engine: PropTypes.object,
};
