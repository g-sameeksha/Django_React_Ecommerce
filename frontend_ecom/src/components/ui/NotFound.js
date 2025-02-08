import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center" >
      <h1 className="display-3 text-danger fw-bold">404</h1>
      <p className="lead">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn mt-3" style={{backgroundColor:"#6050dc" ,color:"white"}}>
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
