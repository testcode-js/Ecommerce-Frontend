import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdHome, IoMdMenu, IoMdClose } from 'react-icons/io';
import { FaShoppingBag, FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaBoxOpen, FaTachometerAlt, FaSearch, FaBell, FaCog, FaHistory, FaTags, FaStar, FaBlog, FaUserCircle, FaInfoCircle } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';
import { BsTelephoneFill } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SearchBar from './SearchBar';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="modern-header">
        <div className="header-top">
          <div className="container">
            <div className="header-content">
              <Link to="/" className="logo">
                <span className="logo-text">ShopHub</span>
                <span className="logo-dot">.</span>
              </Link>

              <div className="search-container">
                <SearchBar />
                <button 
                  className="search-toggle-btn"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <FaSearch />
                </button>
              </div>

              <div className="header-actions">
                {isAuthenticated && (
                  <>
                    {/* Notifications */}
                    <Link to="/notifications" className="action-btn" title="Notifications">
                      <FaBell />
                      <span className="badge pulse">3</span>
                    </Link>

                    <Link to="/user/wishlist" className="action-btn" title="Wishlist">
                      <FaHeart />
                      {wishlistCount > 0 && (
                        <span className="badge">{wishlistCount}</span>
                      )}
                    </Link>

                    <Link to="/user/cart" className="action-btn" title="Cart">
                      <FaShoppingCart />
                      {cartCount > 0 && (
                        <span className="badge">{cartCount}</span>
                      )}
                    </Link>
                  </>
                )}

                {!isAuthenticated ? (
                  <div className="auth-buttons">
                    <Link to="/login" className="btn btn-outline">Login</Link>
                    <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                  </div>
                ) : (
                  <div className="user-dropdown">
                    <button className="user-menu-btn">
                      <FaUser />
                      <span>{user?.name?.split(' ')[0]}</span>
                    </button>
                    <div className="dropdown-menu">
                      {/* User Info Section */}
                      <div className="dropdown-header">
                        <div className="user-info">
                          <div className="user-avatar">
                            <FaUser />
                          </div>
                          <div className="user-details">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-email">{user?.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="dropdown-divider"></div>

                      {/* Quick Actions */}
                      <div className="dropdown-section">
                        <span className="section-title">Quick Actions</span>
                        <Link to="/notifications" className="dropdown-item">
                          <FaBell /> Notifications
                        </Link>
                        <Link to="/profile" className="dropdown-item">
                          <FaUser /> Profile
                        </Link>
                        <Link to="/orders" className="dropdown-item">
                          <FaBoxOpen /> My Orders
                        </Link>
                        <Link to="/user/wishlist" className="dropdown-item">
                          <FaHeart /> Wishlist
                        </Link>
                        <Link to="/dashboard" className="dropdown-item">
                          <FaHistory /> Dashboard
                        </Link>
                      </div>

                      <div className="dropdown-divider"></div>

                      {/* Settings */}
                      <div className="dropdown-section">
                        <Link to="/settings" className="dropdown-item">
                          <FaCog /> Settings
                        </Link>
                        <button className="dropdown-item logout" onClick={handleLogout}>
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <IoMdClose /> : <IoMdMenu />}
              </button>
            </div>
          </div>
        </div>

        <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="container">
            <ul className="nav-links">
              <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}><IoMdHome /> Home</Link></li>
              <li><Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}><FaShoppingBag /> Shop</Link></li>
              <li><Link to="/categories" onClick={() => setIsMobileMenuOpen(false)}><FaTags /> Categories</Link></li>
              <li><Link to="/deals" onClick={() => setIsMobileMenuOpen(false)}><FaStar /> Deals</Link></li>
              <li><Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}><FaBlog /> Blog</Link></li>
              <li><Link to={isAuthenticated ? "/profile" : "/login"} onClick={() => setIsMobileMenuOpen(false)}><FaUserCircle /> Profile</Link></li>
              <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}><FaInfoCircle /> About</Link></li>
              <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}><BsTelephoneFill /> Contact</Link></li>
              <li><Link to="/help" onClick={() => setIsMobileMenuOpen(false)}><FaCircleInfo /> Help</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      <style>{`
        .modern-header {
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-top {
          padding: 1rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          font-size: 1.8rem;
          font-weight: 800;
          color: #1e293b;
        }

        .logo-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-dot {
          color: #667eea;
        }

        .search-container {
          flex: 1;
          max-width: 500px;
          position: relative;
        }

        .search-toggle-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #64748b;
          cursor: pointer;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .action-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f8fafc;
          color: #64748b;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        .action-btn .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4757;
          color: #fff;
          font-size: 0.7rem;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn .badge.pulse {
          animation: pulse 2s infinite;
        }

          70% {
            box-shadow: 0 0 0 10px rgba(255, 71, 87, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
          }
        }

        .auth-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          padding: 0.5rem 1.2rem;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .btn-outline {
          border-color: var(--accent-color);
          color: var(--accent-color);
        }

        .btn-outline:hover {
          background: var(--accent-color);
          color: #fff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102,126,234,0.4);
        }

        .user-dropdown {
          position: relative;
        }

        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--bg-secondary);
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-menu-btn:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--card-bg);
          border-radius: 12px;
          box-shadow: var(--card-shadow);
          min-width: 200px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }

        .user-dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1rem;
          color: var(--text-primary);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: var(--bg-secondary);
          color: var(--accent-color);
        }

        .dropdown-item.logout {
          color: #ff4757;
        }

        .dropdown-item.logout:hover {
          background: #ffe0e0;
        }

        .dropdown-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .user-email {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-color);
          margin: 0.5rem 0;
        }

        .dropdown-section {
          padding: 0.5rem 0;
        }

        .section-title {
          display: block;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .main-nav {
          background: var(--card-bg);
        }

        .nav-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 2rem;
        }

        .nav-links a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 0;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-links a:hover {
          color: var(--accent-color);
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        @media (max-width: 768px) {
          .search-container {
            display: none;
          }

          .search-toggle-btn {
            display: block;
          }

          .header-actions .auth-buttons {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .main-nav {
            position: fixed;
            top: 0;
            left: -100%;
            width: 80%;
            height: 100vh;
            background: var(--card-bg);
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            transition: left 0.3s ease;
            z-index: 999;
          }

          .main-nav.open {
            left: 0;
          }

          .nav-links {
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
          }

          .nav-links a {
            padding: 1rem;
            border-radius: 8px;
          }

          .nav-links a:hover {
            background: var(--bg-secondary);
          }
        }
      `}</style>
    </>
  );
};

export default Header;