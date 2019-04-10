import React from 'react';
import {Button, Icon, Menu} from 'semantic-ui-react';
import SearchForm from './search';
import history from '../history';

const Navbar = () => {
  return (
    <Menu fixed="top" size="small">
      <Menu.Item as={Button} onClick={() => history.push('')}>
        <Icon name="arrow left" />Home
      </Menu.Item>

      {/* <Menu.Item as={SearchForm} /> */}
      <Menu.Item>
        <SearchForm />
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
