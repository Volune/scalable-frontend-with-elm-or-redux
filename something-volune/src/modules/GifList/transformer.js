import { toTransformer, EVENTS as ENGINE_EVENTS } from 'engine';
import Msg from './messages';

export default [
  [
    ENGINE_EVENTS.INIT,
    Msg.TOPIC_ADDED,
    {
      *create(
        source,
        { getApiProps }
      ) {
        const {
          defaultTopics = [],
        } = getApiProps();
        for (const topic of defaultTopics) {
          yield {
            topic,
          };
        }
      },
    },
  ],
  [
    Msg.NEW_TOPIC_CHANGED,
    Msg.NEW_TOPIC_CHANGED,
    {
      create(
        { args }
      ) {
        const [event] = args;
        return {
          newTopic: event.currentTarget.value,
        };
      },
      preventDefault: true,
    },
  ],
  [
    Msg.TOPIC_ADDED,
    Msg.TOPIC_ADDED,
    {
      create(
        source,
        { getState }
      ) {
        const { newTopic } = getState();
        return {
          topic: newTopic,
        };
      },
      preventDefault: true,
    },
  ],
  [
    Msg.INTERNAL_GIF_RECEIVED,
    Msg.GIF_RECEIVED,
    {
      create(
        { args, getEmitterProps }
      ) {
        const [url] = args;
        return {
          url,
          index: getEmitterProps().index,
        };
      },
    },
  ],
]::toTransformer();
