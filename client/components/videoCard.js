import React from 'react';
import {Card, Image} from 'semantic-ui-react';

const VideoCard = props => {
  console.log('image is', props.highlight.image);
  return (
    <Card
      className="videoCard"
      header={props.highlight.blurb}
      image={() => <Image src={props.highlight.image} />}
      onClick={() => props.open(props.highlight.video, props.highlight.image)}
    />
  );
};

export default VideoCard;
