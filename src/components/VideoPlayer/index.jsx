/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import videojs from 'video.js';
import './index.css';


export default class VideoPlayer extends React.Component {
  componentDidMount() {
    console.log('VideoPlayer componentDidMount '+JSON.stringify(this.props));
    this.player = videojs(this.videoNode, this.props);
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div>
        <div>
          <video preload="auto" ref={(node) => { this.videoNode = node; }} className="video-js" />
        </div>
      </div>
    );
  }
}
