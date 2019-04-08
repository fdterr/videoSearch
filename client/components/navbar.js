import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Button, Icon, Menu} from 'semantic-ui-react';
import SearchForm from './search';
// import history from '../history';

const Navbar = props => {
  const {handleClick, isLoggedIn} = props;
  console.log('navbar rendered');
  // console.log('history is', props.history);
  return (
    <Menu>
      <Link to="">
        <Menu.Item>
          <Button id="homeButton">
            <Icon name="arrow left" />Back
          </Button>
        </Menu.Item>
      </Link>
      <Menu.Item>
        <SearchForm />
      </Menu.Item>
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
