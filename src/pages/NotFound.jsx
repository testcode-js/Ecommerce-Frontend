import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 text-center">
          <FaExclamationTriangle size={80} className="text-warning mb-4" />
          
          <h1 className="display-1 fw-bold text-primary">404</h1>
          
          <h2 className="mb-3">Page Not Found</h2>
          
          <p className="text-muted mb-4">
            Oops! The page you're looking for doesn't exist or has been moved. 
            Don't worry, let's get you back on track.
          </p>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/">
              <Button title={<><FaHome className="me-2" />Go Home</>} />
            </Link>
            <Link to="/shop">
              <Button title={<><FaSearch className="me-2" />Browse Shop</>} />
            </Link>
          </div>

          <div className="mt-5">
            <h5 className="mb-3">Popular Links</h5>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/shop" className="text-decoration-none">Shop</Link>
              <Link to="/about" className="text-decoration-none">About Us</Link>
              <Link to="/contact" className="text-decoration-none">Contact</Link>
              <Link to="/user/cart" className="text-decoration-none">Cart</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
