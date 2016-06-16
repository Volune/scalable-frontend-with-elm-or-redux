import { PropTypes } from 'react';
import { component } from 'engine/react';
import PairOfGifPair from './component';
import consume from './consumer';
import transform from './transformer';

const AssembledPairOfGifPair = component({
  transform,
  consume,
})(PairOfGifPair);

AssembledPairOfGifPair.propTypes = {
  topics: PairOfGifPair.propTypes.topics,
  onNewGif: PropTypes.func,
};

export default AssembledPairOfGifPair;
