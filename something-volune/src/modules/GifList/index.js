import { PropTypes } from 'react';
import { component } from 'engine/react';
import GifList from './component';
import consume from './consumer';
import transform from './transformer';
import reduce from './reducer';
import Msg from './messages';

const mapStateToProps = (state) => (state);
const mapEventsToProps = () => ({
  onAddTopic: Msg.TOPIC_ADDED,
  onNewTopicChange: Msg.NEW_TOPIC_CHANGED,
});

const AssembledGifPair = component({
  mapStateToProps,
  mapEventsToProps,
  transform,
  consume,
  reduce,
})(GifList);

AssembledGifPair.propTypes = {
  defaultTopics: GifList.propTypes.topics,
  onNewGif: PropTypes.func,
};

export default AssembledGifPair;
