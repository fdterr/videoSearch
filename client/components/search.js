import React, {Component} from 'react';
import {Search, Label} from 'semantic-ui-react';
import axios from 'axios';
import history from '../history';

const makeSource = players => {
  const source = players.map(player => ({
    title: player.fullName,
    image: (
      <img
        src={`https://gd.mlb.com/images/gameday/mugshots/mlb/${
          player.playerId
        }.jpg`}
      />
    ),
    id: player.playerId
  }));
  return source;
};
let source = [];

export default class SearchForm extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({...this.state, isLoading: false, results: [], value: ''});

  handleResultSelect = (e, {result}) => {
    console.log('result', result);
    history.push(`/players/video/${result.id}`);
  };

  handleSearchChange = (e, {value}) => {
    this.setState({...this.state, isLoading: true, value});

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        ...this.state,
        isLoading: false,
        results: _.filter(source, isMatch)
      });
    }, 300);
  };

  async componentDidMount() {
    const {data} = await axios.get('/api/players');
    // console.log('data is', data);
    source = makeSource(data);
    // console.log('source is', source);
    this.setState({...this.state, source});
  }

  render() {
    const {isLoading, value, results} = this.state;
    // console.log('this.state.source', this.state.source);

    return (
      <div className="search">
        {!!this.state.source && (
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true
            })}
            results={results}
            value={value}
            {...this.props}
          />
        )}
      </div>
    );
  }
}
