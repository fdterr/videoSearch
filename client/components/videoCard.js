import React from 'react';
import {Card, Image, Loader, Dimmer} from 'semantic-ui-react';

const VideoCard = props => {
  // console.log('image is', props.highlight.image);
  return (
    <div>
      {props.highlight !== 'loader' ? (
        <Card
          className="videoCard"
          header={props.highlight.blurb}
          image={() => <Image src={props.highlight.image} />}
          onClick={() =>
            props.open(props.highlight.video, props.highlight.image)
          }
        />
      ) : (
        <Card className="videoPlaceholder">
          <Dimmer active inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
        </Card>
      )}
    </div>
  );
};

export default VideoCard;
