import React from 'react';
import NavBar from '../components/menu/NavBar';
import SideMenu from '../components/menu/SideMenu';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MainLayout = ({children}) => {
  return (
    <Container>
      <NavBar />
      <Row>
        <Col><SideMenu /></Col>
        <Col>{children}</Col>
      </Row>
    </Container>
  );
};

export default MainLayout;