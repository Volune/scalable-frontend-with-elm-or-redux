import { PropTypes } from 'react';
import { createEngine } from 'engine';
import { assemble } from 'engine/react';
import GifList from './component';
import consume from './consumer';
import transform from './transformer';
import mapper from './mapper';
import reduce from './reducer';
import Msg from './messages';

const mapStateToProps = (state) => (state);
const mapEventsToProps = () => ({
  onAddTopic: Msg.TOPIC_ADDED,
  onNewTopicChange: Msg.NEW_TOPIC_CHANGED,
});

const AssembledGifPair = assemble({
  engineFactory(engineOptions) {
    return createEngine({
      ...engineOptions,
      mapper,
      transform,
      consume,
      reduce,
    });
  },
  mapStateToProps,
  mapEventsToProps,
})(GifList);

AssembledGifPair.propTypes = {
  defaultTopics: GifList.propTypes.topics,
  onNewGif: PropTypes.func,
};

export default AssembledGifPair;
