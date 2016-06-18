import { toMapper } from 'engine';
import Msg from './messages';

export default [
  [
    Msg.GIF_RECEIVED,
    {
      map({
        args,
        getEmitterProps,
      }) {
        const [url] = args;
        return {
          url,
          index: getEmitterProps().index,
        };
      },
    },
  ],
]::toMapper();
