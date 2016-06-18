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
        return {
          ...args[0],
          pairIndex: getEmitterProps().index,
        };
      },
    },
  ],
]::toMapper();
