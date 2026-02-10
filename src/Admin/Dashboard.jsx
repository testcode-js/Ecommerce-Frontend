import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaTags, FaRupeeSign, FaChartLine, FaEye, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          API.get('/products'),
          API.get('/orders'),
        ]);

        const products = productsRes.data.products || [];
        const orders = ordersRes.data || [];

        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const lowStockProducts = products.filter(product => (product.countInStock || 0) < 5).length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: 1, // This would come from users API
          totalRevenue,
          pendingOrders,
          lowStockProducts,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FaBox,
      color: 'primary',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FaShoppingCart,
      color: 'success',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'warning',
      change: '+15%',
      changeType: 'increase'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: FaRupeeSign,
      color: 'info',
      change: '+23%',
      changeType: 'increase'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: FaChartLine,
      color: 'danger',
      change: '-5%',
      changeType: 'decrease'
    },
    {
      title: 'Low Stock Products',
      value: stats.lowStockProducts,
      icon: FaTags,
      color: 'warning',
      change: '+2',
      changeType: 'increase'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="row mb-4">
        {statCards.map((stat, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div className={`stat-card ${stat.color}`}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">{stat.title}</h6>
                  <h3 className="mb-0">{stat.value}</h3>
                  <div className={`d-flex align-items-center mt-2 ${stat.changeType === 'increase' ? 'text-success' : 'text-danger'}`}>
                    {stat.changeType === 'increase' ? <FaArrowUp className="me-1" /> : <FaArrowDown className="me-1" />}
                    <small>{stat.change}</small>
                  </div>
                </div>
                <div className={`stat-icon ${stat.color}`}>
                  <stat.icon />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="admin-card">
            <div className="card-header">
              <h5 className="mb-0">Recent Orders</h5>
            </div>
            <div className="card-body">
              {recentOrders.length > 0 ? (
                <div className="admin-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id?.slice(-8)}</td>
                          <td>{order.user?.name || 'Guest'}</td>
                          <td>${order.totalPrice?.toFixed(2)}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Link to="/admin/orders" className="btn btn-sm btn-primary-admin">
                              <FaEye />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="admin-card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="quick-actions">
                <div className="d-grid gap-3">
                  <Link to="/admin/add-product" className="btn btn-primary-admin">
                    <FaBox className="me-2" />
                    Add New Product
                  </Link>
                  <Link to="/admin/add-category" className="btn btn-primary-admin">
                    <FaTags className="me-2" />
                    Add New Category
                  </Link>
                  <Link to="/admin/orders" className="btn btn-primary-admin">
                    <FaShoppingCart className="me-2" />
                    Manage Orders
                  </Link>
                  <Link to="/admin/coupons" className="btn btn-primary-admin">
                    <FaRupeeSign className="me-2" />
                    Manage Coupons
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered': return 'success';
    case 'processing': return 'primary';
    case 'pending': return 'warning';
    case 'cancelled': return 'danger';
    default: return 'secondary';
  }
};

export default AdminDashboard;
