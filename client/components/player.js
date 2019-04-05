import React, {Component} from 'react';
import {Dimmer, Loader} from 'semantic-ui-react';
import axios from 'axios';

export default class Player extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      player: {}
    };
  }

  async componentDidMount() {}

  render() {
    return (
      <div>
        {this.state.loading ? (
          <Dimmer active inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
        ) : (
          <div>Testing...testing...1, 2, 3</div>
        )}
      </div>
    );
  }
}
