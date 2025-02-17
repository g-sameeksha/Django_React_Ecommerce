import React from 'react';
import { Link } from 'react-router-dom';
import NavBarLink from './NavBarLink';
import styles from './NavBar.module.css';

const NavBar = ({ numCartItem }) => { 
  // ✅ Get user type from localStorage
  const userType = localStorage.getItem("usertype");

  return (
    <>
      <nav 
        className="navbar navbar-expand-lg shadow" 
        data-bs-theme="dark" 
        style={{ color: "black", backgroundColor: "white" }}
      >
        <div className="container-fluid">
          {/* ✅ Navigate to Vendor Dashboard if user is a vendor */}
          <Link 
            className="navbar-brand" 
            style={{ color: "black" }} 
            to={userType === "vendor" ? "/vendor_dashboard" : "/"}
          >
            E_Commerce
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarColor01" 
            aria-controls="navbarColor01" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor01">
            <NavBarLink />
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
