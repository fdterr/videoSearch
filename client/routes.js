import React, {Component} from 'react';

import {Route, Switch} from 'react-router-dom';

import {Home, Player} from './components';

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        {/* <Route path="/login" component={Login} /> */}
        <Route exact path="/players/video/:id" component={Player} />
        <Route component={Home} />
      </Switch>
    );
  }
}

export default Routes;
