import React, {Component} from 'react';
import {
  Dimmer,
  Loader,
  // Header,
  Segment,
  Embed,
  TransitionablePortal,
  Visibility
} from 'semantic-ui-react';
import axios from 'axios';
import VideoCard from './videoCard';

export default class Player extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      player: [],
      animation: 'browse',
      duration: 500,
      open: false,
      video: '',
      image: '',
      dimmed: false,
      games: []
    };
  }

  handleClick = (video, image) => {
    this.setState({
      ...this.state,
      open: !this.state.open,
      video: !this.state.open ? video : undefined,
      image: !this.state.open ? image : undefined
    });
  };

  handleClose = () => {
    this.setState({...this.state, open: !this.state.open});
  };

  async componentDidMount() {
    const playerId = this.props.match.params.id;
    let {data} = await axios.get(`/api/player/${playerId}/games/2018`);
    const games = data;

    let response = await axios.put(
      `/api/player/${playerId}/content`,
      data.splice(0, 9)
    );
    data = response.data;

    const highlights = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const event = data[i][j];
        const image = event.image.cuts.find(cut => {
          if (cut.aspectRatio === '16:9' && cut.width > 500) {
            return true;
          }
        });
        const highlight = {
          image: image.src,
          video: event.playbacks[0].url,
          key: event.guid,
          blurb: event.blurb,
          description: event.description
        };
        highlights.push(highlight);
      }
    }
    this.setState({...this.state, player: highlights, loading: false, games});
  }

  render() {
    const {animation, duration, open, dimmed} = this.state;
    return (
      <div>
        <div>
          {this.state.loading ? (
            <Dimmer active inverted>
              <Loader inverted>Loading...</Loader>
            </Dimmer>
          ) : (
            <Dimmer.Dimmable as={Segment} dimmed={open}>
              <div className="videoList">
                {this.state.player.map(highlight => {
                  return (
                    <VideoCard highlight={highlight} open={this.handleClick} />
                  );
                })}
              </div>
              <Dimmer active={open} />
            </Dimmer.Dimmable>
          )}
        </div>
        <TransitionablePortal
          open={open}
          transition={{animation, duration}}
          onClose={() => this.handleClose()}
        >
          <Segment
            style={{
              left: '12.5%',
              position: 'fixed',
              top: '15%',
              zIndex: 1000,
              width: '75%'
            }}
          >
            <Embed
              icon="right circle arrow"
              placeholder={this.state.image}
              url={this.state.video}
              aspectRatio="16:9"
              // active={true}
            />
          </Segment>
        </TransitionablePortal>
      </div>
    );
  }
}
