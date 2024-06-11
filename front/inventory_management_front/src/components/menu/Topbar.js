import React, { useState } from "react";
import {
  Navbar,
  NavbarToggler,
} from "reactstrap";

const Topbar = () => {
  const [topbarIsOpen, setTopbarOpen] = useState(true);
  const toggleTopbar = () => setTopbarOpen(!topbarIsOpen);

  return (
    <Navbar
      color="light"
      light
      className="navbar shadow-sm p-3 mb-5 bg-white rounded"
      expand="md"
    >
      <NavbarToggler onClick={toggleTopbar} />
    </Navbar>
  );
};

export default Topbar;
