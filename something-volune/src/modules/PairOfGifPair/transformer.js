import { toTransformer } from 'engine';
import Msg from './messages';

export default [
  [
    Msg.INTERNAL_GIF_RECEIVED,
    Msg.GIF_REQUESTED,
    {
      create({
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
]::toTransformer();
