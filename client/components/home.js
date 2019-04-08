import _ from 'lodash';
import React, {Component} from 'react';
import axios from 'axios';
import SearchForm from './search';

const Home = props => {
  console.log('home rendered');
  return (
    <div id="homeSearch">
      <SearchForm history={props.history} />
    </div>
  );
};

export default Home;
