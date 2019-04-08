import React, {Component} from 'react';
import {
  Button,
  Dimmer,
  Loader,
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
      loadingPreview: false,
      year: 2019
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
    const games = await this.getGames(playerId, this.state.year);
    await this.grabGames(games, playerId);
  }

  getGames = async (playerId, year) => {
    let {data} = await axios.get(`/api/player/${playerId}/games/${year}`);
    return data;
  };

  grabGames = async (games, playerId) => {
    console.log('games are', games);
    console.log('year is', this.state.year);
    const {highlights} = this.state;
    while (highlights[highlights.length - 1] === 'loader') {
      highlights.pop();
    }
    let {year} = this.state;

    if (!games.length && this.state.year > 2012) {
      // this.setState()
      console.log('no games, getting games for one year behind');
      // await this.setState({...this.state, years: this.state.years - 1});
      games = await this.getGames(this.state.playerId, --year);
      if (!games.length) {
        games = await this.getGames(this.state.playerId, --year);
      }
      console.log('games are', games);
      console.log('year is', year);
    }

    let {data} = await axios.put(
      `/api/player/${playerId}/content`,
      // data.splice(0, 9)
      games.splice(0, 2)
    );

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const event = data[i][j];
        const image = event.image.cuts.find(cut => {
          return cut.aspectRatio === '16:9' && cut.width > 500;
        });
        const video = this.videoFinder(event);

        const highlight = {
          image: image.src,
          video: video.url,
          key: event.guid,
          blurb: event.blurb,
          description: event.description
        };
        highlights.push(highlight);
      }
    }
    // console.log('highlights are', highlights);
    this.setState({
      ...this.state,
      highlights,
      loading: false,
      games,
      playerId,
      loadingPreview: false,
      year
    });
    console.log('highlights state set');
    if (this.state.highlights.length < 10) {
      console.log('not enough events, grabbing more');
      this.grabGamesHelper();
    }
  };

  videoFinder = event => {
    if (event.playbacks[0].width) {
      return event.playbacks.find(playback => {
        if (playback.width === '1280') {
          return true;
        }
      });
    } else {
      return event.playbacks[0];
    }
  };

  grabGamesHelper = async () => {
    const {highlights} = this.state;
    highlights.push('loader');
    await this.setState({...this.state, highlights, loadingPreview: true});
    await this.grabGames(this.state.games, this.state.playerId);
  };

  // handleUpdate = (e, {calculations}) => {
  //   console.log('handleUpdate is', calculations);
  // };

  render() {
    const {animation, duration, open, highlights, loading} = this.state;
    return (
      <div>
        <div>
          {loading ? (
            <Dimmer active inverted>
              <Loader inverted>Loading...</Loader>
            </Dimmer>
          ) : (
            <Dimmer.Dimmable as={Segment} dimmed={open}>
              <Visibility
                className="videoList"
                fireOnMount
                once={false}
                // onUpdate={this.handleUpdate}
                onBottomVisible={() => {
                  this.grabGamesHelper();
                }}
              >
                {/* <div className="videoList"> */}
                {highlights.map(highlight => {
                  return (
                    <VideoCard highlight={highlight} open={this.handleClick} />
                  );
                })}
                {/* </div> */}
              </Visibility>
              <Button id="loadButton" onClick={this.grabGamesHelper}>
                More
              </Button>
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
