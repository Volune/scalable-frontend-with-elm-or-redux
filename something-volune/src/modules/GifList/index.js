import { PropTypes } from 'react';
import { createEngine } from 'engine';
import { assemble } from 'engine/react';
import GifList from './component';
import consumer from './consumer';
import transformer from './transformer';
import mapper from './mapper';
import reducer from './reducer';
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
      transformer,
      consumer,
      reducer,
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
