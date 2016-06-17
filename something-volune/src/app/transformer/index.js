import { toTransformer } from 'engine';
import Msg from '../messages';

const createCounterIncremented = (sourceMessage, { getState }) => {
  console.log(sourceMessage)
  const {
    incrementByTwoEnabled,
    counterValue,
  } = getState();

  const souldIncrementByTwo = incrementByTwoEnabled && counterValue >= 10;
  return {
    increment: souldIncrementByTwo ? 2 : 1,
  };
};

export default [
  [
    Msg.GIF_RECEIVED,
    Msg.COUNTER_INCREMENTED,
    {
      create: createCounterIncremented,
    },
  ],
]::toTransformer();
