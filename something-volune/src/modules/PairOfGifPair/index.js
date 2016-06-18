import { PropTypes } from 'react';
import { assemble } from 'engine/react';
import { createEngine } from 'engine';
import PairOfGifPair from './component';
import consume from './consumer';
import mapper from './mapper';

const AssembledPairOfGifPair = assemble({
  engineFactory(engineOptions) {
    return createEngine({
      ...engineOptions,
      mapper,
      consume,
    });
  },
})(PairOfGifPair);

AssembledPairOfGifPair.propTypes = {
  topics: PairOfGifPair.propTypes.topics,
  onNewGif: PropTypes.func,
};

export default AssembledPairOfGifPair;
