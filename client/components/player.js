import React, {Component} from 'react';
import {Navbar} from '../components';
import {
  Button,
  Dimmer,
  Embed,
  Icon,
  Loader,
  Segment,
  TransitionablePortal,
  Visibility
} from 'semantic-ui-react';
import axios from 'axios';
import VideoCard from './videoCard';
import {Link} from 'react-router-dom';

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
    // this.grabGames = this.grabGames.bind(this);
    // this.grabGamesHelper = this.grabGamesHelper.bind(this);
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

  updatePlayer = async () => {
    const playerId = this.props.match.params.id;
    const games = await this.getGames(playerId, this.state.year);
    await this.grabGames(games, playerId);
  };

  getGames = async (playerId, year) => {
    let {data} = await axios.get(`/api/player/${playerId}/games/${year}`);
    if (data.length) {
      // data.reverse();
      return data;
    } else {
      return [];
    }
  };

  grabGames = async (games, playerId) => {
    // console.log('games are', games);
    // console.log('year is', this.state.year);
    const {highlights} = this.state;
    while (highlights[highlights.length - 1] === 'loader') {
      highlights.pop();
    }
    let {year} = this.state;

    if (!games.length && this.state.year > 2012) {
      console.log('no games, getting games for one year behind');
      games = await this.getGames(this.state.playerId, --year);
      if (!games.length) {
        games = await this.getGames(this.state.playerId, --year);
      }
      console.log('games are', games);
      console.log('year is', year);
    }

    let {data} = await axios.put(
      `/api/player/${playerId}/content`,
      games.splice(0, 4)
    );

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const event = data[i][j];
        const image = event.image.cuts.find(cut => {
          return cut.aspectRatio === '16:9' && cut.width > 800;
        });
        const video = this.videoFinder(event);

        const highlight = {
          image: image.src,
          video: video.url,
          key: event.guid,
          blurb: event.blurb,
          description: event.description,
          date: event.date
        };
        highlights.push(highlight);
      }
    }
    // console.log('got two games: data length', highlights.length);

    await this.setState({
      ...this.state,
      highlights,
      loading: false,
      games,
      playerId,
      loadingPreview: false,
      year
    });
    if (this.state.highlights.length < 10) {
      this.grabGamesHelper();
    } else if (data[0].length + data[1].length < 1) {
      console.log('got no highlights from these games');
      await this.grabGamesHelper();
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
    // console.log('helper fired');
    if (!this.state.loadingPreview) {
      const {highlights} = this.state;
      highlights.push('loader');
      await this.setState({...this.state, highlights, loadingPreview: true});
      await this.grabGames(this.state.games, this.state.playerId);
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      await this.setState({
        ...this.state,
        highlights: [],
        loading: true,
        year: 2019
      });
      this.updatePlayer();
    }
  }

  handleUpdate = (e, {calculations}) => {
    console.log('handleUpdate is', calculations);
  };

  render() {
    const {animation, duration, open, highlights, loading} = this.state;
    const playerId = this.props.match.params.id;
    let keyIndex = 0;
    return (
      <div key={playerId}>
        <Navbar />
        <div>
          {loading ? (
            <Dimmer inverted>
              <Loader inverted>Loading...</Loader>
            </Dimmer>
          ) : (
            <div className="dimmer">
              <Dimmer.Dimmable dimmed={open}>
                <Visibility
                  className="videoList"
                  fireOnMount
                  once={false}
                  onUpdate={this.handleUpdate}
                  onBottomVisible={() => {
                    this.grabGamesHelper();
                  }}
                >
                  {highlights.map(highlight => {
                    return (
                      <VideoCard
                        highlight={highlight}
                        open={this.handleClick}
                        key={keyIndex++}
                      />
                    );
                  })}
                </Visibility>
                <Button id="loadButton" onClick={this.grabGamesHelper}>
                  More
                </Button>
                <Dimmer active={open} />
              </Dimmer.Dimmable>
            </div>
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
            className="videoPlayer"
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
