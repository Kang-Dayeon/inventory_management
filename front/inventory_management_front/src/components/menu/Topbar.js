import React, { useState } from "react";
import {
  Navbar,
  Tooltip,
  NavbarBrand,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faCartFlatbed
} from "@fortawesome/free-solid-svg-icons";
import useCustomLogin from "../../hooks/useCustomLogin";

const Topbar = () => {
  const {doLogout, moveToLogin} = useCustomLogin()
  const {loginState} = useCustomLogin()

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const handleClickLogout = () => {
    doLogout()
    moveToLogin()
  }


  return (
    <Navbar
      color="light"
      light
      className="navbar shadow-sm p-3 mb-5 bg-white rounded d-flex justify-content-end align-items-center"
      expand="md"
    >
      <NavbarBrand href="/" className="header-icon">
        <FontAwesomeIcon icon={faCartFlatbed} />
      </NavbarBrand>
      <div className="d-flex justify-content-center align-items-center header-right">
        <p class="mb-0 font-weight-bold">{loginState.name} 様</p>
        <button className="icon-btn logout ml-2" onClick={handleClickLogout} id="logout">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
        <Tooltip
          placement="bottom"
          isOpen={tooltipOpen}
          target="logout"
          toggle={toggle}
          autohide={false}
        >
          LOGOUT
        </Tooltip>
      </div>
      
    </Navbar>
  );
};

export default Topbar;
