import React from 'react';
import {Card} from 'semantic-ui-react';

const VideoCard = props => {
  return (
    <Card
      className="videoCard"
      header={props.highlight.blurb}
      image={props.highlight.image}
      onClick={() => props.open(props.highlight.video, props.highlight.image)}
    />
  );
};

export default VideoCard;
