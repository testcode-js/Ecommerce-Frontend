import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaCheck, FaTruck, FaFilter, FaFileInvoice } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleMarkPaid = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/pay`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as paid');
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/deliver`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as delivered');
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await API.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });

      const contentType = response.headers?.['content-type'] || '';
      if (contentType.includes('application/json')) {
        const text = await response.data.text();
        let message = 'Failed to download invoice';
        try {
          const parsed = JSON.parse(text);
          message = parsed?.message || message;
        } catch (_) {
          // ignore JSON parse failure
        }
        alert(message);
        return;
      }

      if (!contentType.includes('application/pdf')) {
        alert('Invoice download failed (unexpected response type)');
        return;
      }

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${orderId.slice(-8).toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to download invoice');
    }
  };

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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter((o) => o.status === filter);

  if (loading) return <Loading message="Loading orders..." />;

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Orders ({orders.length})</h2>
        <div className="d-flex gap-2 align-items-center">
          <FaFilter className="text-muted" />
          <select 
            className="form-select" 
            style={{ width: 'auto' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No orders found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                    </Link>
                  </td>
                  <td>
                    <div>{order.user?.name || 'N/A'}</div>
                    <small className="text-muted">{order.user?.email}</small>
                  </td>
                  <td>{order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}</td>
                  <td className="fw-bold">₹{order.totalPrice}</td>
                  <td>
                    <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                    {!order.isPaid && (
                      <button
                        className="btn btn-sm btn-outline-success ms-1"
                        onClick={() => handleMarkPaid(order._id)}
                        title="Mark as Paid"
                      >
                        <FaCheck size={12} />
                      </button>
                    )}
                  </td>
                  <td>
                    <select
                      className={`form-select form-select-sm ${getStatusBadge(order.status).replace('bg-', 'border-')}`}
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      style={{ width: 'auto', minWidth: '120px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link
                        to={`/order/${order._id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="View Details"
                      >
                        <FaEye />
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => downloadInvoice(order._id)}
                        title="Download Invoice"
                      >
                        <FaFileInvoice />
                      </button>
                      {!order.isDelivered && order.status === 'Shipped' && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleMarkDelivered(order._id)}
                          title="Mark as Delivered"
                        >
                          <FaTruck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
