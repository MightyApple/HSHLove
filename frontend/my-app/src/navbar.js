import React from "react";
import './navbar.css';


function Navbar() {
  return (
    <nav>
      <form>
        <div className="navbarleft">
          <i className="fas fa-home"></i>
        </div>
        <div className="navbarcenter">
          <a href="/">
            <img src="logo.png" alt="Logo" />
          </a>
        </div>
        <div className="navbarright">
          <i className="fas fa-search"></i>
        </div>
      </form>
    </nav>
  );
}

export default Navbar;
