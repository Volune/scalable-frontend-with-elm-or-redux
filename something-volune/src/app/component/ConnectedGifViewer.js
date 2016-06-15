import { connect } from 'engine/react';
import GifViewer from 'modules/GifViewer';
import Msg from '../messages';

const mapMessagesToProps = {
  onNewGif: Msg.GIF_RECEIVED,
};

export default connect({
  mapMessagesToProps,
})(GifViewer);
