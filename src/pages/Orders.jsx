import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaBox } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loading message="Loading your orders..." />;

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <FaBox className="me-2" />
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <FaBox size={60} className="text-muted mb-3" />
          <h5>No orders yet</h5>
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} items</td>
                  <td className="fw-bold">₹{order.totalPrice}</td>
                  <td>
                    <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline-primary">
                      <FaEye className="me-1" />
                      View
                    </Link>
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

export default Orders;
