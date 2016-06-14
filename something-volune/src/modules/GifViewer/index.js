import { PropTypes } from 'react';
import { component } from 'engine';
import GifViewer from './component';
import consumer from './consumer';
import reducer from './reducer';
import Msg from './messages';

const mapStateToProps = (state) => (state);
const mapMessagesToProps = {
  onRequestMore: Msg.GIF_REQUESTED,
};

const AssembledGifViewer = component({
  mapStateToProps,
  mapMessagesToProps,
  consumer,
  reducer,
})(GifViewer);

AssembledGifViewer.propTypes = {
  topic: PropTypes.string.isRequired,
  onNewGif: PropTypes.func,
};
