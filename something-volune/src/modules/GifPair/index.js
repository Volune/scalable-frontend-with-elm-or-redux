import { PropTypes } from 'react';
import { component } from 'engine/react';
import { createEngine } from 'engine';
import GifPair from './component';
import consume from './consumer';
import transform from './transformer';

const AssembledGifPair = component({
  engineFactory(engineOptions) {
    return createEngine({
      ...engineOptions,
      transform,
      consume,
    });
  },
})(GifPair);

AssembledGifPair.propTypes = {
  topics: GifPair.propTypes.topics,
  onNewGif: PropTypes.func,
};

export default AssembledGifPair;
