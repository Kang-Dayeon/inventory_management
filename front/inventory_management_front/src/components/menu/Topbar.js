import React, { useState } from "react";
import {
  Navbar,
  NavbarToggler,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import useCustomLogin from "../../hooks/useCustomLogin";

const Topbar = () => {
  const {doLogout, moveToLogin} = useCustomLogin()

  const handleClickLogout = () => {
    doLogout()
    moveToLogin()
  }

  return (
    <Navbar
      color="light"
      light
      className="navbar shadow-sm p-3 mb-5 bg-white rounded d-flex justify-content-end"
      expand="md"
    >
      <button className="icon-btn" onClick={handleClickLogout}>
       <FontAwesomeIcon icon={faRightFromBracket} />
      </button>
      
    </Navbar>
  );
};

export default Topbar;
