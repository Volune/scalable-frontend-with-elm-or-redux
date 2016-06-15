import { toConsumer } from 'engine';
import Msg from './messages';

export default [
  [
    Msg.GIF_REQUESTED,
    (message, { dispatch, getProps, getDependencies }) => {
      const { topic } = getProps();
      getDependencies().service.fetchGif(topic).then(url => {
        dispatch({
          type: Msg.GIF_RECEIVED,
          url,
        });
      });
    },
  ],
  [
    Msg.GIF_RECEIVED,
    (message, { getProps }) => {
      const { url } = message;
      const { onNewGif } = getProps();
      if (onNewGif) {
        onNewGif(url);
      }
    },
  ],
]::toConsumer();
