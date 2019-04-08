import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Button, Icon, Menu} from 'semantic-ui-react';
import SearchForm from './search';
import history from '../history';

const Navbar = props => {
  const {handleClick, isLoggedIn} = props;
  console.log('navbar rendered');
  // console.log('history is', props.history);
  return (
    <Menu>
      <Menu.Item as={Button} onClick={() => history.push('')}>
        <Icon name="arrow left" />Home
      </Menu.Item>
      <Menu.Item as={SearchForm} />
    </Menu>
    // </div>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default connect(mapState, mapDispatch)(Navbar);

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
