import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaBox, 
  FaShoppingCart, 
  FaHeart, 
  FaChartLine, 
  FaHistory, 
  FaClock, 
  FaTruck, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaDownload,
  FaBell,
  FaCalendarAlt,
  FaCreditCard,
  FaTag,
  FaStar
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
    savedMoney: 0,
    memberSince: ''
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user orders
        const { data: orders } = await API.get('/orders/myorders');
        
        // Calculate stats
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const pendingOrders = orders.filter(order => order.status === 'Pending').length;
        const completedOrders = orders.filter(order => order.status === 'Delivered').length;
        const savedMoney = orders.reduce((acc, order) => {
          const discount = order.discountAmount || 0;
          return acc + discount;
        }, 0);
        
        setStats({
          totalOrders,
          totalSpent,
          pendingOrders,
          completedOrders,
          savedMoney,
          memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
        });
        
        // Get recent orders (last 5)
        const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        setRecentOrders(sortedOrders);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'bg-warning',
      Processing: 'bg-info',
      Shipped: 'bg-primary',
      Delivered: 'bg-success',
      Cancelled: 'bg-danger',
    };
    return badges[status] || 'bg-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FaUser className="me-2" />
          Welcome back, {user?.name?.split(' ')[0]}!
        </h2>
        <div className="text-muted">
          <small>Member since {stats.memberSince}</small>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stats.totalOrders}</h4>
                  <small>Total Orders</small>
                </div>
                <FaBox size={30} className="opacity-75" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">₹{stats.totalSpent.toLocaleString()}</h4>
                  <small>Total Spent</small>
                </div>
                <FaCreditCard size={30} className="opacity-75" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stats.pendingOrders}</h4>
                  <small>Pending Orders</small>
                </div>
                <FaClock size={30} className="opacity-75" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">₹{stats.savedMoney.toLocaleString()}</h4>
                  <small>Saved Money</small>
                </div>
                <FaTag size={30} className="opacity-75" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link to="/shop" className="btn btn-outline-primary w-100">
                    <FaShoppingCart className="me-2" />
                    Continue Shopping
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/user/wishlist" className="btn btn-outline-danger w-100">
                    <FaHeart className="me-2" />
                    View Wishlist ({wishlistCount})
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/orders" className="btn btn-outline-info w-100">
                    <FaHistory className="me-2" />
                    Order History
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/profile" className="btn btn-outline-secondary w-100">
                    <FaUser className="me-2" />
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Orders */}
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaHistory className="me-2" />
                Recent Orders
              </h5>
              <Link to="/orders" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <div className="text-center py-4">
                  <FaBox size={40} className="text-muted mb-3" />
                  <h6>No orders yet</h6>
                  <p className="text-muted small">Start shopping to see your order history</p>
                  <Link to="/shop" className="btn btn-primary btn-sm">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id}>
                          <td>
                            <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{order.orderItems.length} items</td>
                          <td className="fw-bold">₹{order.totalPrice}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline-primary">
                              <FaEye />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaBell className="me-2" />
                Recent Activity
              </h5>
            </div>
            <div className="card-body">
              <div className="activity-feed">
                <div className="activity-item d-flex align-items-start mb-3">
                  <div className="activity-icon bg-primary text-white rounded-circle p-2 me-3">
                    <FaBox size={12} />
                  </div>
                  <div className="activity-content">
                    <h6 className="mb-1">Order Placed</h6>
                    <p className="text-muted small mb-0">Your order #ABC123 has been placed successfully</p>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                </div>
                
                <div className="activity-item d-flex align-items-start mb-3">
                  <div className="activity-icon bg-success text-white rounded-circle p-2 me-3">
                    <FaTruck size={12} />
                  </div>
                  <div className="activity-content">
                    <h6 className="mb-1">Order Shipped</h6>
                    <p className="text-muted small mb-0">Your order #ABC456 is on its way</p>
                    <small className="text-muted">1 day ago</small>
                  </div>
                </div>
                
                <div className="activity-item d-flex align-items-start mb-3">
                  <div className="activity-icon bg-warning text-white rounded-circle p-2 me-3">
                    <FaTag size={12} />
                  </div>
                  <div className="activity-content">
                    <h6 className="mb-1">New Deal Available</h6>
                    <p className="text-muted small mb-0">Save up to 50% on selected items</p>
                    <small className="text-muted">2 days ago</small>
                  </div>
                </div>
                
                <div className="activity-item d-flex align-items-start">
                  <div className="activity-icon bg-info text-white rounded-circle p-2 me-3">
                    <FaStar size={12} />
                  </div>
                  <div className="activity-content">
                    <h6 className="mb-1">Product Review</h6>
                    <p className="text-muted small mb-0">You reviewed "Summer Dress"</p>
                    <small className="text-muted">3 days ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recommended for You</h5>
            </div>
            <div className="card-body">
              <div className="recommendation-item d-flex align-items-center mb-3">
                <img
                  src="https://via.placeholder.com/60"
                  alt="Product"
                  className="rounded me-3"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                  <h6 className="mb-1">Summer Collection</h6>
                  <p className="text-muted small mb-0">Based on your recent purchases</p>
                  <span className="text-primary fw-bold">₹1,299</span>
                </div>
              </div>
              
              <div className="recommendation-item d-flex align-items-center">
                <img
                  src="https://via.placeholder.com/60"
                  alt="Product"
                  className="rounded me-3"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                  <h6 className="mb-1">Trending Now</h6>
                  <p className="text-muted small mb-0">Popular in your area</p>
                  <span className="text-primary fw-bold">₹899</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
