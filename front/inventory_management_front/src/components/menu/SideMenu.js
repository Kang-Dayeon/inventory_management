import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const SideMenu = () => {

  return (
    <ListGroup defaultActiveKey="#link1">
      <ListGroup.Item action href="#link1">
        Link 1
      </ListGroup.Item>
      <ListGroup.Item action href="#link2">
        Link 2
      </ListGroup.Item>
      <ListGroup.Item action>
        This one is a button
      </ListGroup.Item>
    </ListGroup>
  );
};

export default SideMenu;