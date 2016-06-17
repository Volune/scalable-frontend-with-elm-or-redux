import { toTransformer } from 'engine';
import Msg from './messages';

export default [
  [
    Msg.INTERNAL_GIF_RECEIVED,
    Msg.GIF_RECEIVED,
    {
      create({
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
]::toTransformer();