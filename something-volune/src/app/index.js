import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { createEngine, component } from 'engine';
import transformer from './transformer';
import reducer from './reducer';
import * as Msg from './messages';
import GifViewer from './component/ConnectedGifViewer';
import Button from 'modules/Button';
import Counter from 'modules/Counter';

const CONTAINER_DOM_ID = 'app';

const App = ({
  counterValue,
  incrementByTwoEnabled,
  onNewGif,
  onToggleIncrementByTwoToggled,
}) => (
  <div>
    <div style={{ float: 'left' }}>
      <h2>GifViewer</h2>
      <GifViewer onNewGif={onNewGif} />
    </div>
    <div style={{ float: 'left' }}>
      <Button value={incrementByTwoEnabled} onClick={onToggleIncrementByTwoToggled} />
      <Counter value={counterValue} />
    </div>
  </div>
);

App.propTypes = {
  counterValue: PropTypes.number.isRequired,
  incrementByTwoEnabled: PropTypes.bool.isRequired,
  onNewGif: PropTypes.func,
  onToggleIncrementByTwoToggled: PropTypes.func,
};

const mapStateToProps = (state) => state;
const mapMessagesToProps = {
  onNewGif: Msg.GIF_RECEIVED,
  onToggleIncrementByTwoToggled: Msg.INCREMENT_BY_TWO_TOGGLED,
};

const AssembledApp = component({
  mapStateToProps,
  mapMessagesToProps,
  transformer,
  reducer,
  engineFactory: (ignoredPropsEngine, ignoredContextEngine, options) => createEngine(options),
})(App);

render(<AssembledApp />, document.getElementById(CONTAINER_DOM_ID));
