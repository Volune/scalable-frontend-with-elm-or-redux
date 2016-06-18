import { PropTypes } from 'react';
import { component } from 'engine/react';
import { createEngine } from 'engine';
import GifViewer from './component';
import consume from './consumer';
import reduce from './reducer';
import transform from './transformer';
import * as service from './service';
import Msg from './messages';

const mapStateToProps = (state) => (state);
const mapEventsToProps = () => ({
  onRequestMore: Msg.GIF_REQUESTED,
});
const provideDependencies = () => ({
  service,
});

const AssembledGifViewer = component({
  engineFactory(engineOptions) {
    return createEngine({
      ...engineOptions,
      transform,
      consume,
      reduce,
    });
  },
  mapStateToProps,
  mapEventsToProps,
  provideDependencies,
})(GifViewer);

AssembledGifViewer.propTypes = {
  ...AssembledGifViewer.propTypes,
  topic: GifViewer.propTypes.topic,
  onNewGif: PropTypes.func,
};

export default AssembledGifViewer;
