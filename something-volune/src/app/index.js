import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import { component } from 'engine/react';
import transform from './transformer';
import reduce from './reducer';
import Msg from './messages';
import GifViewer from './component/ConnectedGifViewer';
import Button from 'modules/Button';
import Counter from 'modules/Counter';

const CONTAINER_DOM_ID = 'app';

const App = ({
  counterValue,
  incrementByTwoEnabled,
  onNewGif,
  onIncrementByTwoToggled,
}) => (
  <div>
    <div style={{ float: 'left' }}>
      <h2>GifViewer</h2>
      <GifViewer topic="funny cats" onNewGif={onNewGif} />
    </div>
    <div style={{ float: 'left' }}>
      <Button value={incrementByTwoEnabled} onClick={onIncrementByTwoToggled} />
      <Counter value={counterValue} />
    </div>
  </div>
);

App.propTypes = {
  counterValue: PropTypes.number.isRequired,
  incrementByTwoEnabled: PropTypes.bool.isRequired,
  onNewGif: PropTypes.func,
  onIncrementByTwoToggled: PropTypes.func,
};

const mapStateToProps = (state) => state;
const mapEventsToProps = () => ({
  onNewGif: Msg.GIF_RECEIVED,
  onIncrementByTwoToggled: Msg.INCREMENT_BY_TWO_TOGGLED,
});

const AssembledApp = component({
  mapStateToProps,
  mapEventsToProps,
  transform,
  reduce,
})(App);

render(<AssembledApp />, document.getElementById(CONTAINER_DOM_ID));
