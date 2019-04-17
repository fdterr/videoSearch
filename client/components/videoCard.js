import React from 'react';
import {Card, Image, Loader, Dimmer} from 'semantic-ui-react';

const VideoCard = props => {
  // console.log('videoCard props is', props);
  const date = new Date(highlightDate(props.highlight));
  console.log('date is', date);
  const text = cardText(props.highlight.blurb, date);
  return (
    <div>
      {props.highlight !== 'loader' ? (
        <Card
          // key={props.highlight.date || props.highlight.key}
          className="videoCard"
          // header={props.highlight.blurb}
          header={text}
          image={() => <Image src={props.highlight.image} />}
          onClick={() =>
            props.open(
              props.highlight.video,
              props.highlight.image,
              props.highlight.description
            )
          }
        />
      ) : (
        <Card className="videoPlaceholder" header=" ">
          <Dimmer active inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
        </Card>
      )}
    </div>
  );
};

export default VideoCard;

const highlightDate = highlight => {
  return new Date(highlight.date);
};

const cardText = (blurb, date) => {
  return `${date.getMonth()}/${date.getDay()}/${date
    .getFullYear()
    .toString()
    .slice(2)} ${blurb}`;
};
