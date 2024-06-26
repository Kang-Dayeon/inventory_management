import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBriefcase,
  faAddressBook,
  faCommentsDollar,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavItem, NavLink, Nav } from "reactstrap";
import { Link } from "react-router-dom";

const SideBar = ({ isOpen, toggleSidebar }) => (
  <div className={`sidebar ${isOpen ? 'is-open' : ''}`}>
    <div className="sidebar-header">
      <span className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faAnglesRight} />
      </span>
      <h3>Inventory Management</h3>
    </div>
    <div className="side-menu">
      <Nav vertical className="list-unstyled pb-3">
        <NavItem>
          <NavLink tag={Link} to={"/"}>
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={"/product"}>
            <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
            Product
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={"/transaction"}>
            <FontAwesomeIcon icon={faCommentsDollar} className="mr-2" />
            Transactions
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={"/supplier"}>
           <FontAwesomeIcon icon={faAddressBook} className="mr-2" />
            Supplier
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  </div>
);

export default SideBar;
