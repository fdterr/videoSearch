import React from 'react';
import {Card, Image, Loader, Dimmer} from 'semantic-ui-react';

const VideoCard = props => {
  // console.log('key is', props.key);
  return (
    <div>
      {props.highlight !== 'loader' ? (
        <Card
          // key={props.highlight.date || props.highlight.key}
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
