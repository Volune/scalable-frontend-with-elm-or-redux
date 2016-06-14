import { connect } from 'engine';
import GifViewer from 'modules/GifViewer';
import * as Msg from '../messages';

const mapMessagesToProps = {
  onNewGif: Msg.GIF_RECEIVED,
};

export default connect({
  mapMessagesToProps,
})(GifViewer);
