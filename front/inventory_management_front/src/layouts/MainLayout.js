import React, {useState} from 'react';
import SideBar from '../components/menu/Sidebar';
import Topbar from '../components/menu/Topbar';
import { Container } from "reactstrap";
import classNames from "classnames";
import LoadingComponent from '../components/common/LoadingComponent';
import useCustomLoading from '../hooks/useCustomLoading';

const MainLayout = ({children}) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  const {isLoading}= useCustomLoading()
  
  return (
    <div className='wrapper'>
      <SideBar isOpen={sidebarIsOpen} toggleSidebar={toggleSidebar}  />
      <Container
        fluid
        className={classNames("content", { "is-open": sidebarIsOpen })}
      >
        <Topbar/>
        {isLoading ? (
          <LoadingComponent />
        ): (
          children
        )}
      </Container>
    </div>
  );
};

export default MainLayout;