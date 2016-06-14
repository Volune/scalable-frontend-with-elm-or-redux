import * as Msg from './messages';

const DEFAULT_STATE = {
  url: '/assets/loading.gif',
};

export default (state = DEFAULT_STATE, message, { args }) => {
  switch (message) {
    case Msg.GIF_RECEIVED: {
      const [url] = args;
      return {
        ...state,
        url,
      };
    }
    default:
      return state;
  }
};
