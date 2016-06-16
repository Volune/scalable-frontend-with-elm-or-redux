import { PropTypes } from 'react';
import { component } from 'engine/react';
import GifPair from './component';
import consume from './consumer';
import transform from './transformer';

const AssembledGifPair = component({
  transform,
  consume,
})(GifPair);

AssembledGifPair.propTypes = {
  topics: GifPair.propTypes.topics,
  onNewGif: PropTypes.func,
};

export default AssembledGifPair;
