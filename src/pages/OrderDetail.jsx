import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaBox, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaTruck, 
  FaArrowLeft, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimesCircle,
  FaDownload,
  FaPrint,
  FaHeadset,
  FaPhone,
  FaEnvelope,
  FaShieldAlt,
  FaUndo,
  FaExchangeAlt,
  FaRedo,
  FaEye
} from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSupport, setShowSupport] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);

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

  const getStatusInfo = (status) => {
    const statusMap = {
      Pending: {
        color: '#f39c12',
        icon: FaClock,
        text: 'Pending',
        description: 'Your order is being processed'
      },
      Processing: {
        color: '#3498db',
        icon: FaExclamationTriangle,
        text: 'Processing',
        description: 'Your order is being prepared for shipment'
      },
      Shipped: {
        color: '#9b59b6',
        icon: FaTruck,
        text: 'Shipped',
        description: 'Your order is on its way'
      },
      Delivered: {
        color: '#27ae60',
        icon: FaCheckCircle,
        text: 'Delivered',
        description: 'Your order has been delivered'
      },
      Cancelled: {
        color: '#e74c3c',
        icon: FaTimesCircle,
        text: 'Cancelled',
        description: 'Your order has been cancelled'
      }
    };
    return statusMap[status] || statusMap.Pending;
  };

  const getStatusSteps = () => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(order?.status);
    
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex && order.status !== 'Cancelled',
      current: index === currentIndex,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await API.get(`/orders/${order._id}/invoice`, {
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
      link.setAttribute('download', `Invoice_${order._id.slice(-8).toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      try {
        const blob = err.response?.data;
        const contentType = err.response?.headers?.['content-type'] || '';
        if (blob && typeof blob.text === 'function' && contentType.includes('application/json')) {
          const text = await blob.text();
          const parsed = JSON.parse(text);
          alert(parsed?.message || 'Failed to download invoice');
          return;
        }
      } catch (_) {
        // ignore
      }
      alert('Failed to download invoice');
    }
  };

  const handleViewInvoice = async () => {
    try {
      const response = await API.get(`/orders/${order._id}/invoice`, {
        responseType: 'blob',
      });

      const contentType = response.headers?.['content-type'] || '';
      if (contentType.includes('application/json')) {
        const text = await response.data.text();
        alert('Failed to view invoice');
        return;
      }

      if (!contentType.includes('application/pdf')) {
        alert('Invoice view failed (unexpected response type)');
        return;
      }

      const url = window.URL.createObjectURL(response.data);
      window.open(url, '_blank');
      
      // Note: We can't revoke the object URL immediately if we want the new tab to use it.
      // It will be cleared when the document is unloaded.
    } catch (err) {
      console.error('Error viewing invoice:', err);
      alert('Failed to view invoice');
    }
  };

  const handleReorder = async () => {
    try {
      // Add all items back to cart
      for (const item of order.orderItems) {
        await API.post('/cart', {
          productId: item.product,
          quantity: item.quantity
        });
      }
      // Redirect
      window.location.href = '/user/cart';
    } catch (error) {
      console.error('Reorder error:', error);
    }
  };

  const handleTrackOrder = async () => {
    try {
      // Simulate tracking API call
      setTrackingInfo({
        trackingNumber: 'TRK123456789',
        carrier: 'Express Delivery',
        estimatedDelivery: '2024-01-15',
        currentLocation: 'Distribution Center, Delhi',
        status: 'In Transit',
        updates: [
          { date: '2024-01-12', time: '10:30 AM', location: 'Warehouse, Mumbai', status: 'Package picked up' },
          { date: '2024-01-12', time: '2:45 PM', location: 'Distribution Center, Mumbai', status: 'In transit' },
          { date: '2024-01-13', time: '9:15 AM', location: 'Distribution Center, Delhi', status: 'Arrived at destination' }
        ]
      });
    } catch (error) {
      console.error('Tracking error:', error);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await API.put(`/orders/${order._id}/cancel`);
      alert('Order cancelled successfully');
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Cancel order error:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleReturnOrder = async () => {
    if (!window.confirm('Are you sure you want to return this order?')) return;
    
    try {
      await API.put(`/orders/${order._id}/return`);
      alert('Return request submitted successfully');
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Return order error:', error);
      alert(error.response?.data?.message || 'Failed to request return');
    }
  };

  const handleReplaceOrder = async () => {
    if (!window.confirm('Are you sure you want to request a replacement?')) return;
    
    try {
      await API.put(`/orders/${order._id}/replace`);
      alert('Replacement request submitted successfully');
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Replace order error:', error);
      alert(error.response?.data?.message || 'Failed to request replacement');
    }
  };

  const canCancel = (status) => {
    const s = status?.toLowerCase();
    return s === 'pending' || s === 'processing';
  };

  const canReturnOrReplace = (status) => {
    const s = status?.toLowerCase();
    return s === 'delivered';
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
        <div>
          <h2 className="mb-0">Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}</h2>
          <span className={`badge ${getStatusBadge(order.status)} fs-6`}>{order.status}</span>
        </div>
        <div className="d-flex gap-2">
            <Button
              title={<><FaEye className="me-2" /> View Invoice</>}
              onClick={handleViewInvoice}
              className="btn-outline-primary"
            />
            <Button
              title={<><FaDownload className="me-2" /> Download</>}
              onClick={handleDownloadInvoice}
              className="btn-primary"
            />
        </div>
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
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <FaBox className="me-2" />
                <h5 className="mb-0">Order Items ({order.orderItems.length})</h5>
              </div>
              <Button
                title={<FaRedo />}
                onClick={handleReorder}
                className="btn-outline-primary btn-sm"
              >
                Reorder All
              </Button>
            </div>
            <div className="card-body">
              {order.orderItems.map((item, index) => (
                <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={item.image ? (item.image.startsWith('http') ? item.image : `${UPLOADS_URL}/${item.image}`) : 'https://placehold.co/80'}
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

          {/* Tracking Information */}
          {order.status === 'Shipped' && (
            <div className="card mb-4">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FaTruck className="me-2" />
                  <h5 className="mb-0">Tracking Information</h5>
                </div>
                <Button
                  title="Track Order"
                  onClick={handleTrackOrder}
                  className="btn-outline-primary btn-sm"
                />
              </div>
              <div className="card-body">
                {trackingInfo ? (
                  <div>
                    <div className="mb-3">
                      <strong>Tracking Number:</strong> {trackingInfo.trackingNumber}
                    </div>
                    <div className="mb-3">
                      <strong>Carrier:</strong> {trackingInfo.carrier}
                    </div>
                    <div className="mb-3">
                      <strong>Estimated Delivery:</strong> {trackingInfo.estimatedDelivery}
                    </div>
                    <div className="mb-3">
                      <strong>Current Location:</strong> {trackingInfo.currentLocation}
                    </div>
                    <div className="timeline">
                      {trackingInfo.updates.map((update, index) => (
                        <div key={index} className="d-flex mb-3">
                          <div className="me-3">
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                              {index + 1}
                            </div>
                          </div>
                          <div>
                            <div className="fw-bold">{update.status}</div>
                            <small className="text-muted">
                              {update.date} at {update.time} - {update.location}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">Click "Track Order" to get tracking information</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {/* Quick Actions */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Button
                  title={<><FaDownload className="me-2" />Download Invoice</>}
                  onClick={handleDownloadInvoice}
                  className="btn-outline-primary"
                />
                <Button
                  title={<><FaHeadset className="me-2" />Need Help?</>}
                  onClick={() => setShowSupport(!showSupport)}
                  className="btn-outline-info"
                />
                {canReturnOrReplace(order.status) && (
                  <>
                    <Button
                      title={<><FaUndo className="me-2" />Return Order</>}
                      onClick={handleReturnOrder}
                      className="btn-outline-warning"
                    />
                    <Button
                      title={<><FaExchangeAlt className="me-2" />Replace Order</>}
                      onClick={handleReplaceOrder}
                      className="btn-outline-info"
                    />
                  </>
                )}
                {canCancel(order.status) && (
                  <Button
                    title={<><FaTimesCircle className="me-2" />Cancel Order</>}
                    onClick={handleCancelOrder}
                    className="btn-outline-danger"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Support Section */}
          {showSupport && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Customer Support</h5>
              </div>
              <div className="card-body">
                <p className="mb-3">Need help with your order? Our support team is here to assist you.</p>
                <div className="d-grid gap-2">
                  <a href="mailto:support@shophub.com" className="btn btn-outline-primary">
                    <FaEnvelope className="me-2" />
                    Email Support
                  </a>
                  <a href="tel:+919876543210" className="btn btn-outline-primary">
                    <FaPhone className="me-2" />
                    Call Support
                  </a>
                </div>
              </div>
            </div>
          )}

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
                  {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Not Paid'}
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
                    ? `Delivered on ${formatDate(order.deliveredAt)}`
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
        <small>Order placed on: {formatDateTime(order.createdAt)}</small>
      </div>
    </div>
  );
};

export default OrderDetail;
