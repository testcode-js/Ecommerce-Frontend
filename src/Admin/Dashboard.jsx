import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaTags, FaRupeeSign, FaChartLine, FaEye, FaBook, FaExclamationTriangle, FaArrowUp, FaArrowDown } from 'react-icons/fa';
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
    totalBlogs: 0,
    activeDeals: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes, usersRes, blogsRes, dealsRes] = await Promise.all([
          API.get('/products'),
          API.get('/orders'),
          API.get('/users'),
          API.get('/blogs'),
          API.get('/deals'),
        ]);

        const products = productsRes.data.products || [];
        const orders = ordersRes.data || [];
        const users = usersRes.data || [];
        const blogs = blogsRes.data?.blogs || [];
        const deals = dealsRes.data?.deals || [];

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const lowStockProducts = products.filter(product => (product.countInStock || 0) < 5).length;
        const activeDeals = deals.filter(deal => deal.status === 'active').length;

        const currentMonthOrders = orders.filter(order => new Date(order.createdAt) >= currentMonthStart).length;
        const lastMonthOrders = orders.filter(order => {
          const date = new Date(order.createdAt);
          return date >= lastMonthStart && date <= lastMonthEnd;
        }).length;
        const orderChange = lastMonthOrders > 0 ? Math.round(((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100) : 0;

        const currentMonthRevenue = orders
          .filter(order => new Date(order.createdAt) >= currentMonthStart)
          .reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        const lastMonthRevenue = orders
          .filter(order => {
            const date = new Date(order.createdAt);
            return date >= lastMonthStart && date <= lastMonthEnd;
          })
          .reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        const revenueChange = lastMonthRevenue > 0 ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;

        const currentMonthUsers = users.filter(user => new Date(user.createdAt) >= currentMonthStart).length;
        const lastMonthUsers = users.filter(user => {
          const date = new Date(user.createdAt);
          return date >= lastMonthStart && date <= lastMonthEnd;
        }).length;
        const userChange = lastMonthUsers > 0 ? Math.round(((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100) : 0;

        const pendingChange = orders.filter(order => order.status === 'pending').length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          pendingOrders,
          lowStockProducts,
          totalBlogs: blogs.length,
          activeDeals,
          orderChange,
          revenueChange,
          userChange,
          pendingChange,
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
      link: '/admin/products',
      change: null,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FaShoppingCart,
      color: 'success',
      link: '/admin/orders',
      change: stats.orderChange,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'warning',
      link: '/admin/users',
      change: stats.userChange,
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: FaRupeeSign,
      color: 'info',
      link: '/admin/orders',
      change: stats.revenueChange,
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: FaChartLine,
      color: 'danger',
      link: '/admin/orders',
      change: null,
    },
    {
      title: 'Active Deals',
      value: stats.activeDeals,
      icon: FaTags,
      color: 'warning',
      link: '/admin/deals',
      change: null,
    },
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: FaBook,
      color: 'primary',
      link: '/admin/blogs',
      change: null,
    },
    {
      title: 'Low Stock',
      value: stats.lowStockProducts,
      icon: FaExclamationTriangle,
      color: 'danger',
      link: '/admin/products',
      change: null,
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="row mb-4">
        {statCards.map((stat, index) => (
          <div key={index} className="col-lg-3 col-md-6 mb-4">
            <Link to={stat.link} className="text-decoration-none">
              <div className={`stat-card ${stat.color}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">{stat.title}</h6>
                    <h3 className="mb-0">{stat.value}</h3>
                  </div>
                  <div className={`stat-icon ${stat.color}`}>
                    <stat.icon />
                  </div>
                </div>
              </div>
            </Link>
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
