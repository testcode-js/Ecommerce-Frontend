import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEye, 
  FaBox, 
  FaFilter, 
  FaSearch, 
  FaCalendarAlt, 
  FaTruck, 
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExclamationTriangle,
  FaDownload,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSync
} from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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

  const getStatusInfo = (status) => {
    const statusMap = {
      Pending: {
        color: '#f39c12',
        icon: FaClock,
        text: 'Pending'
      },
      Processing: {
        color: '#3498db',
        icon: FaExclamationTriangle,
        text: 'Processing'
      },
      Shipped: {
        color: '#9b59b6',
        icon: FaTruck,
        text: 'Shipped'
      },
      Delivered: {
        color: '#27ae60',
        icon: FaCheckCircle,
        text: 'Delivered'
      },
      Cancelled: {
        color: '#e74c3c',
        icon: FaTimesCircle,
        text: 'Cancelled'
      }
    };
    return statusMap[status] || statusMap.Pending;
  };

  const getPaymentInfo = (isPaid) => ({
    color: isPaid ? '#27ae60' : '#f39c12',
    text: isPaid ? 'Paid' : 'Pending'
  });

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= filterDate
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'total':
          comparison = a.totalPrice - b.totalPrice;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredOrders = filterAndSortOrders();

  if (loading) return <Loading message="Loading your orders..." />;

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FaBox className="me-2" />
          My Orders
        </h2>
        <div className="d-flex gap-2">
          <Button 
            title={<FaSync />}
            onClick={() => window.location.reload()}
            className="btn-outline-secondary"
          />
          <Button 
            title={<FaFilter />}
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline-secondary ${showFilters ? 'active' : ''}`}
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by order ID or product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="col-md-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="col-md-2">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>

              {/* Sort */}
              <div className="col-md-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                >
                  <option value="date">Sort by Date</option>
                  <option value="total">Sort by Total</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="col-md-1">
                <Button
                  title={sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                  onClick={toggleSortOrder}
                  className="btn-outline-secondary w-100"
                />
              </div>

              {/* Clear Filters */}
              <div className="col-md-1">
                <Button
                  title="Clear"
                  onClick={clearFilters}
                  className="btn-outline-danger w-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
        {filteredOrders.length > 0 && (
          <Button
            title={<FaDownload />}
            className="btn-outline-primary"
          >
            Export
          </Button>
        )}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <FaBox size={60} className="text-muted mb-3" />
          <h5>No orders yet</h5>
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <FaBox size={60} className="text-muted mb-3" />
          <h5>No orders found</h5>
          <p className="text-muted">No orders match your current filters.</p>
          <Button onClick={clearFilters} title="Clear Filters" className="btn-outline-primary" />
        </div>
      ) : (
        <div className="row">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const paymentInfo = getPaymentInfo(order.isPaid);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={order._id} className="col-lg-6 mb-4">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Order #{order._id.slice(-8).toUpperCase()}</h6>
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        {formatDate(order.createdAt)}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <span 
                        className="badge d-flex align-items-center gap-1"
                        style={{ backgroundColor: statusInfo.color }}
                      >
                        <StatusIcon size={12} />
                        {statusInfo.text}
                      </span>
                      <span 
                        className="badge"
                        style={{ backgroundColor: paymentInfo.color }}
                      >
                        {paymentInfo.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    {/* Order Items Preview */}
                    <div className="mb-3">
                      <div className="d-flex gap-2 mb-2">
                        {order.orderItems.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.image ? `${import.meta.env.VITE_UPLOADS_URL}/${item.image}` : 'https://via.placeholder.com/60'}
                            alt={item.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        ))}
                        {order.orderItems.length > 3 && (
                          <div 
                            className="rounded bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px', fontSize: '0.8rem' }}
                          >
                            +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>
                      <small className="text-muted">
                        {order.orderItems.length} items • Total: ₹{order.totalPrice}
                      </small>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-3">
                      <small className="text-muted">
                        <strong>Shipping to:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.city}
                      </small>
                    </div>
                  </div>
                  
                  <div className="card-footer bg-transparent">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold">₹{order.totalPrice}</span>
                        <span className="text-muted ms-2">
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <Link 
                        to={`/order/${order._id}`} 
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaEye className="me-1" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
