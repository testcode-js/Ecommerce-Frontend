import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBox, FaMapMarkerAlt, FaCreditCard, FaTruck, FaArrowLeft } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Fetch order error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

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

  const getStatusSteps = () => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(order.status);

    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex && order.status !== 'Cancelled',
      current: index === currentIndex,
    }));
  };

  if (loading) return <Loading message="Loading order details..." />;

  if (!order) {
    return (
      <div className="container my-5 text-center">
        <h4>Order not found</h4>
        <Link to="/orders">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <Link to="/orders" className="btn btn-outline-secondary mb-4">
        <FaArrowLeft className="me-2" />
        Back to Orders
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Order #{order._id.slice(-8).toUpperCase()}</h2>
        <span className={`badge ${getStatusBadge(order.status)} fs-6`}>{order.status}</span>
      </div>

      {/* Order Progress */}
      {order.status !== 'Cancelled' && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              {getStatusSteps().map((step, index) => (
                <div key={step.name} className="text-center flex-grow-1">
                  <div
                    className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${
                      step.completed ? 'bg-success text-white' : 'bg-light'
                    }`}
                    style={{ width: '40px', height: '40px' }}
                  >
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <small className={step.current ? 'fw-bold' : 'text-muted'}>{step.name}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          {/* Order Items */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <FaBox className="me-2" />
              <h5 className="mb-0">Order Items ({order.orderItems.length})</h5>
            </div>
            <div className="card-body">
              {order.orderItems.map((item, index) => (
                <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={item.image ? `${UPLOADS_URL}/${item.image}` : 'https://via.placeholder.com/80'}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    className="rounded me-3"
                  />
                  <div className="flex-grow-1">
                    <Link to={`/product/${item.product}`} className="text-decoration-none">
                      <h6 className="mb-1">{item.name}</h6>
                    </Link>
                    <p className="mb-0 text-muted">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <div className="fw-bold">₹{item.quantity * item.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <FaMapMarkerAlt className="me-2" />
              <h5 className="mb-0">Shipping Address</h5>
            </div>
            <div className="card-body">
              <p className="mb-1">
                <strong>{order.shippingAddress.fullName}</strong>
              </p>
              <p className="mb-1">{order.shippingAddress.address}</p>
              <p className="mb-1">
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="mb-1">{order.shippingAddress.country}</p>
              <p className="mb-0">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Payment Info */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <FaCreditCard className="me-2" />
              <h5 className="mb-0">Payment</h5>
            </div>
            <div className="card-body">
              <p className="mb-2">
                <span className="text-muted">Method:</span> {order.paymentMethod}
              </p>
              <p className="mb-0">
                <span className="text-muted">Status:</span>{' '}
                <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>
                  {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
                </span>
              </p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <FaTruck className="me-2" />
              <h5 className="mb-0">Delivery</h5>
            </div>
            <div className="card-body">
              <p className="mb-0">
                <span className="text-muted">Status:</span>{' '}
                <span className={`badge ${order.isDelivered ? 'bg-success' : 'bg-info'}`}>
                  {order.isDelivered
                    ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                    : 'In Progress'}
                </span>
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{order.itemsPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>{order.shippingPrice > 0 ? `₹${order.shippingPrice}` : 'FREE'}</span>
              </div>
              {order.taxPrice > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>₹{order.taxPrice}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>₹{order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted mt-4">
        <small>Order placed on: {new Date(order.createdAt).toLocaleString()}</small>
      </div>
    </div>
  );
};

export default OrderDetail;
