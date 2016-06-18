import { PropTypes } from 'react';
import { component } from 'engine/react';
import { createEngine } from 'engine';
import PairOfGifPair from './component';
import consume from './consumer';
import transform from './transformer';

const AssembledPairOfGifPair = component({
  engineFactory(engineOptions) {
    return createEngine({
      ...engineOptions,
      transform,
      consume,
    });
  },
})(PairOfGifPair);

AssembledPairOfGifPair.propTypes = {
  topics: PairOfGifPair.propTypes.topics,
  onNewGif: PropTypes.func,
};

export default AssembledPairOfGifPair;
