import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdHome } from 'react-icons/io';
import { FaShoppingBag, FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaBoxOpen, FaTachometerAlt } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';
import { BsTelephoneFill } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SearchBar from './SearchBar';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg"
            alt={import.meta.env.VITE_APP_NAME}
            height="30"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav m-auto">
            <li className="nav-item">
              <Link className="nav-link cart-icon" to="/">
                <IoMdHome size={22} />
                <span className="m-1">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link cart-icon" to="/shop">
                <FaShoppingBag size={18} />
                <span className="m-1">Shop</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link cart-icon" to="/about">
                <FaCircleInfo size={18} />
                <span className="m-1">About</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link cart-icon" to="/contact">
                <BsTelephoneFill size={18} />
                <span className="m-1">Contact</span>
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <SearchBar />

            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="nav-link position-relative" title="Wishlist">
                  <FaHeart size={20} />
                  {wishlistCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="nav-link position-relative" title="Cart">
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <div className="d-flex gap-1">
                <Link to="/login"><Button title="Login" /></Link>
                <Link to="/signup"><Button title="Signup" /></Link>
              </div>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser size={14} />
                  {user?.name?.split(' ')[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <FaUser size={14} className="me-2" /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <FaBoxOpen size={14} className="me-2" /> My Orders
                    </Link>
                  </li>
                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item text-primary" to="/admin">
                          <FaTachometerAlt size={14} className="me-2" /> Admin Dashboard
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <FaSignOutAlt size={14} className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;