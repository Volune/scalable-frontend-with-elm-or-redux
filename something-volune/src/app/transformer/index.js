import { toTransformer } from 'engine';
import * as Msg from '../messages';

export default [
  [
    Msg.GIF_RECEIVED,
    Msg.COUNTER_INCREMENTED,
  ],
  [
    Msg.COUNTER_INCREMENTED,
    Msg.COUNTER_INCREMENTED,
    {
      map({ getState }) {
        const souldIncrementByTwo = getState().incrementByTwoEnabled
          && getState().counterValue >= 10;
        return souldIncrementByTwo ? [2] : [1];
      },
    },
  ],
]::toTransformer();
