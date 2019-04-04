import _ from 'lodash';
import faker from 'faker';
import React, {Component} from 'react';
import {Search, Grid, Header, Segment} from 'semantic-ui-react';
import axios from 'axios';

// const players = {

// }

// const source = _.times(5, () => ({
//   title: faker.company.companyName(),
//   description: faker.company.catchPhrase(),
//   image: faker.internet.avatar(),
//   price: faker.finance.amount(0, 100, 2, '$')
// }));
const source = {};

export default class SearchExampleStandard extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({isLoading: false, results: [], value: ''});

  handleResultSelect = (e, {result}) => this.setState({value: result.title});

  handleSearchChange = (e, {value}) => {
    this.setState({isLoading: true, value});

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch)
      });
    }, 300);
  };

  async componentDidMount() {
    const {data} = await axios.get('/api/players');
    console.log('data is', data);
  }

  render() {
    const {isLoading, value, results} = this.state;

    return (
      <div className="search">
        {!!source && (
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
