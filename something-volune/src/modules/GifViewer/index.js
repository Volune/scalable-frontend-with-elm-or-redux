import { PropTypes } from 'react';
import { component } from 'engine/react';
import GifViewer from './component';
import consume from './consumer';
import reduce from './reducer';
import transform from './transformer';
import * as service from './service';
import Msg from './messages';

const mapStateToProps = (state) => (state);
const mapEventsToProps = () => ({
  onRequestMore: Msg.GIF_REQUESTED,
});
const provideDependencies = () => ({
  service,
});

const AssembledGifViewer = component({
  mapStateToProps,
  mapEventsToProps,
  provideDependencies,
  transform,
  consume,
  reduce,
})(GifViewer);

AssembledGifViewer.propTypes = {
  topic: PropTypes.string.isRequired,
  onNewGif: PropTypes.func,
};

export default AssembledGifViewer;
