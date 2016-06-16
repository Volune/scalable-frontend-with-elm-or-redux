import { connect } from 'engine/react';
import GifPair from 'modules/GifPair';
import Msg from '../messages';

const mapEventsToProps = () => ({
  onNewGif: Msg.GIF_RECEIVED,
});

export default connect({
  mapEventsToProps,
})(GifPair);
