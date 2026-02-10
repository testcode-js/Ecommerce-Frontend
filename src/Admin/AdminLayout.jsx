import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingCart, 
  FaTags, 
  FaUsers, 
  FaDollarSign,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChartPie,
  FaHome,
  FaList,
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaClipboardList,
  FaTicketAlt,
  FaUserShield,
  FaBell,
  FaEnvelope,
  FaFileAlt,
  FaBlog,
  FaTag
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Main',
      items: [
        { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
        { path: '/admin', icon: FaHome, label: 'Home' },
      ]
    },
    {
      title: 'Products',
      items: [
        { path: '/admin/add-product', icon: FaPlusCircle, label: 'Add Product' },
        { path: '/admin/products', icon: FaList, label: 'Manage Products' },
        { path: '/admin/add-category', icon: FaPlusCircle, label: 'Add Category' },
        { path: '/admin/categories', icon: FaList, label: 'Manage Categories' },
      ]
    },
    {
      title: 'Orders',
      items: [
        { path: '/admin/orders', icon: FaClipboardList, label: 'All Orders' },
        { path: '/admin/orders/pending', icon: FaShoppingCart, label: 'Pending Orders' },
        { path: '/admin/orders/processing', icon: FaEdit, label: 'Processing' },
        { path: '/admin/orders/completed', icon: FaChartPie, label: 'Completed' },
      ]
    },
    {
      title: 'Users',
      items: [
        { path: '/admin/users', icon: FaUsers, label: 'All Users' },
        { path: '/admin/users/customers', icon: FaUserShield, label: 'Customers' },
        { path: '/admin/users/admins', icon: FaUserShield, label: 'Admin Users' },
      ]
    },
    {
      title: 'Content',
      items: [
        { path: '/admin/add-blog', icon: FaPlusCircle, label: 'Add Blog' },
        { path: '/admin/blogs', icon: FaBlog, label: 'Manage Blogs' },
        { path: '/admin/add-deal', icon: FaPlusCircle, label: 'Add Deal' },
        { path: '/admin/deals', icon: FaTag, label: 'Manage Deals' },
      ]
    },
    {
      title: 'Marketing',
      items: [
        { path: '/admin/coupons', icon: FaTicketAlt, label: 'Coupons' },
        { path: '/admin/notifications', icon: FaBell, label: 'Notifications' },
        { path: '/admin/emails', icon: FaEnvelope, label: 'Email Templates' },
      ]
    },
    {
      title: 'Reports',
      items: [
        { path: '/admin/reports/sales', icon: FaChartPie, label: 'Sales Report' },
        { path: '/admin/reports/products', icon: FaBox, label: 'Product Report' },
        { path: '/admin/reports/users', icon: FaUsers, label: 'User Report' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { path: '/admin/settings', icon: FaCog, label: 'General Settings' },
        { path: '/admin/settings/payment', icon: FaDollarSign, label: 'Payment Settings' },
        { path: '/admin/settings/shipping', icon: FaShoppingCart, label: 'Shipping Settings' },
      ]
    }
  ];

  const getPageTitle = () => {
    for (const section of menuItems) {
      const item = section.items.find(item => item.path === location.pathname);
      if (item) return item.label;
    }
    return 'Admin Panel';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <button 
            className="sidebar-toggle d-lg-none"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="sidebar-menu">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="menu-section">
              <div className="menu-section-title">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-details">
              <div className="admin-name">{user?.name}</div>
              <div className="admin-role">Administrator</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle d-lg-none"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
            <h1 className="page-title">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="header-right">
            <div className="admin-info-header">
              <div className="admin-avatar-header">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="admin-name-header">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
