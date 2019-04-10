import _ from 'lodash';
import React, {Component} from 'react';
import {Header, Icon, Menu} from 'semantic-ui-react';
import SearchForm from './search';

const Home = props => {
  console.log('home rendered');
  return (
    <div>
      <div id="homeSearch">
        <div>
          <Icon size="big" name="video camera" />{' '}
          <Icon size="big" name="baseball ball" />
        </div>
        <Header>Search MLB Highlights...by Player</Header>
        <SearchForm history={props.history} />
      </div>
      <div>
        <Menu
          className="footer"
          fixed="bottom"
          borderless
          style={{display: 'flex', justifyContent: 'center'}}
        >
          <Menu.Item
            onClick={() => (window.location = 'https://github.com/fdterr')}
            style={{width: '100%', display: 'flex', justifyContent: 'center'}}
          >
            videoSearch by Rick Terry
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Home;
