import { toTransformer, EVENTS as ENGINE_EVENTS } from 'engine';
import Msg from './messages';

export default [
  [
    ENGINE_EVENTS.INIT,
    Msg.GIF_REQUESTED,
  ],
]::toTransformer();
