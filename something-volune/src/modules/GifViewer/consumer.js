import toConsumer from 'engine';
import * as Msg from './messages';

export default [
  [
    Msg.GIF_REQUESTED,
    ({ dispatch, getProps, getDependencies }) => {
      const { topic } = getProps();
      getDependencies().service.fetchGif(topic).then(url => {
        dispatch(Msg.GIF_RECEIVED, url);
      });
    },
  ],
  [
    Msg.GIF_RECEIVED,
    ({ args, getProps }) => {
      const [url] = args;
      const { onNewGif } = getProps();
      if (onNewGif) {
        onNewGif(url);
      }
    },
  ],
]::toConsumer();
