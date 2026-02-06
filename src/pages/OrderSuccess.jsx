import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const OrderSuccess = () => {
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

  if (loading) return <Loading message="Loading order details..." />;

  if (!order) {
    return (
      <div className="container my-5 text-center">
        <h4>Order not found</h4>
        <Link to="/orders">View All Orders</Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <FaCheckCircle size={80} className="text-success mb-3" />
        <h2 className="text-success">Order Placed Successfully!</h2>
        <p className="text-muted">Thank you for your purchase. Your order has been received.</p>
        <p className="fs-5">Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong></p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Order Items */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <FaBox className="me-2" />
              <h5 className="mb-0">Order Items</h5>
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
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="mb-0 text-muted">Qty: {item.quantity} × ₹{item.price}</p>
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
              <p className="mb-1"><strong>{order.shippingAddress.fullName}</strong></p>
              <p className="mb-1">{order.shippingAddress.address}</p>
              <p className="mb-1">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="mb-1">{order.shippingAddress.country}</p>
              <p className="mb-0">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <FaCreditCard className="me-2" />
              <h5 className="mb-0">Payment Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <p className="mb-1 text-muted">Payment Method</p>
                  <p className="fw-bold">{order.paymentMethod}</p>
                </div>
                <div className="col-6">
                  <p className="mb-1 text-muted">Payment Status</p>
                  <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card mb-4">
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

          {/* Actions */}
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/orders">
              <Button title="View All Orders" />
            </Link>
            <Link to="/shop">
              <Button title="Continue Shopping" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
