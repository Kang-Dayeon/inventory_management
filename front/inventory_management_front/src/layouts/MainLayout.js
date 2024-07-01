import React, {useState} from 'react';
import SideBar from '../components/menu/Sidebar';
import Topbar from '../components/menu/Topbar';
import { Container } from "reactstrap";
import classNames from "classnames";

const MainLayout = ({children}) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  
  return (
    <div className='wrapper'>
      <SideBar isOpen={sidebarIsOpen} toggleSidebar={toggleSidebar}  />
      <Container
        fluid
        className={classNames("content", { "is-open": sidebarIsOpen })}
      >
        <Topbar/>
        {children}
      </Container>
    </div>
  );
};

export default MainLayout;