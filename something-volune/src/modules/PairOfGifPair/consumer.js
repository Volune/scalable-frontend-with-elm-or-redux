import { toConsumer } from 'engine';
import Msg from './messages';

export default [
  [
    Msg.GIF_RECEIVED,
    (message, { getProps }) => {
      const { onNewGif } = getProps();
      if (onNewGif) {
        onNewGif(message);
      }
    },
  ],
]::toConsumer();
