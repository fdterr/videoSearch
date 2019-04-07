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
      animation: 'browse',
      duration: 500,
      open: false,
      video: '',
      image: '',
      dimmed: false,
      games: [],
      highlights: [],
      playerId: 0,
      loadingPreview: false
    };
    this.grabGames = this.grabGames.bind(this);
    this.grabGamesHelper = this.grabGamesHelper.bind(this);
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
    await this.grabGames(data, playerId);
    // const games = data;

    // let response = await axios.put(
    //   `/api/player/${playerId}/content`,
    //   // data.splice(0, 9)
    //   data.splice(0, 2)
    // );
    // data = response.data;

    // const {highlights} = this.state;
    // for (let i = 0; i < data.length; i++) {
    //   for (let j = 0; j < data[i].length; j++) {
    //     const event = data[i][j];
    //     const image = event.image.cuts.find(cut => {
    //       if (cut.aspectRatio === '16:9' && cut.width > 500) {
    //         return true;
    //       }
    //     });
    //     const highlight = {
    //       image: image.src,
    //       video: event.playbacks[0].url,
    //       key: event.guid,
    //       blurb: event.blurb,
    //       description: event.description
    //     };
    //     highlights.push(highlight);
    //   }
    // }
    // this.setState({...this.state, player: highlights, loading: false, games});
  }

  grabGames = async (games, playerId) => {
    console.log('games are', games);
    const {highlights} = this.state;
    while (highlights[highlights.length - 1] === 'loader') {
      highlights.pop();
    }

    let {data} = await axios.put(
      `/api/player/${playerId}/content`,
      // data.splice(0, 9)
      games.splice(0, 2)
    );
    // data = response.data;

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
    console.log('highlights are', highlights);
    this.setState({
      ...this.state,
      highlights,
      loading: false,
      games,
      playerId,
      loadingPreview: false
    });
  };

  grabGamesHelper = async () => {
    const {highlights} = this.state;
    highlights.push('loader');
    console.log('setting state');
    this.setState({...this.state, highlights, loadingPreview: true});
    console.log('state set');
    this.grabGames(this.state.games, this.state.playerId);
  };

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
                {this.state.highlights.map(highlight => {
                  return (
                    <VideoCard highlight={highlight} open={this.handleClick} />
                  );
                })}
              </div>
              <Visibility
                // continuous={true}
                className="visibility"
                fireOnMount={true}
                once={false}
                // continuous={true}
                onBottomVisible={() => {
                  console.log('onBottomVisible');
                  this.grabGamesHelper();
                }}
                updateOn="repaint"
                // onUpdate={() => this.grabGamesHelper()}
                onOnScreen={() => {
                  console.log('onOnScreen');
                  this.grabGamesHelper();
                }}
              />

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
