import { connect } from 'engine/react';
import GifPair from 'modules/GifPair';
import Msg from '../messages';

const mapEventsToProps = () => ({
  onNewGif: Msg.INTERNAL_GIF_RECEIVED,
});

const ConnectedGifPair = connect({
  mapEventsToProps,
})(GifPair);

ConnectedGifPair.propTypes = {
  ...ConnectedGifPair.propTypes,
  topics: GifPair.propTypes.topics,
};

export default ConnectedGifPair;
