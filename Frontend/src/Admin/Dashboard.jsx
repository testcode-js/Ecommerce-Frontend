import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaTags, FaDollarSign, FaChartLine } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';

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
        const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
        const lowStockProducts = products.filter((p) => p.stock <= 5).length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: 0,
          totalRevenue,
          pendingOrders,
          lowStockProducts,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <div className="container-fluid my-4">
      <h2 className="mb-4">
        <FaChartLine className="me-2" />
        Admin Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 col-lg-2 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body text-center">
              <FaBox size={30} className="mb-2" />
              <h3 className="mb-0">{stats.totalProducts}</h3>
              <small>Products</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-2 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body text-center">
              <FaShoppingCart size={30} className="mb-2" />
              <h3 className="mb-0">{stats.totalOrders}</h3>
              <small>Orders</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-2 mb-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body text-center">
              <FaShoppingCart size={30} className="mb-2" />
              <h3 className="mb-0">{stats.pendingOrders}</h3>
              <small>Pending</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-2 mb-3">
          <div className="card bg-danger text-white h-100">
            <div className="card-body text-center">
              <FaBox size={30} className="mb-2" />
              <h3 className="mb-0">{stats.lowStockProducts}</h3>
              <small>Low Stock</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-4 mb-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body text-center">
              <FaDollarSign size={30} className="mb-2" />
              <h3 className="mb-0">₹{stats.totalRevenue.toLocaleString()}</h3>
              <small>Total Revenue</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="mb-3">Quick Actions</h5>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/admin/add-product" className="btn btn-primary">
              <FaBox className="me-2" />
              Add Product
            </Link>
            <Link to="/admin/add-category" className="btn btn-success">
              <FaTags className="me-2" />
              Add Category
            </Link>
            <Link to="/admin/orders" className="btn btn-info">
              <FaShoppingCart className="me-2" />
              Manage Orders
            </Link>
            <Link to="/admin/coupons" className="btn btn-warning">
              <FaTags className="me-2" />
              Manage Coupons
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <Link to="/admin/orders" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <p className="text-muted text-center">No orders yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <Link to={`/admin/orders/${order._id}`}>
                              #{order._id.slice(-8).toUpperCase()}
                            </Link>
                          </td>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td>₹{order.totalPrice}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
