import { connect } from 'engine/react';
import PairOfGifPair from 'modules/PairOfGifPair';
import Msg from '../messages';

const mapEventsToProps = () => ({
  onNewGif: Msg.GIF_RECEIVED,
});

export default connect({
  mapEventsToProps,
})(PairOfGifPair);
