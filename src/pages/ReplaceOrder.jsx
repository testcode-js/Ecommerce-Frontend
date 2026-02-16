import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const ReplaceOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState('');

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

  const handleSubmit = async () => {
    if (!order) return;
    if (!reason.trim()) {
      alert('Please enter a replacement reason');
      return;
    }

    if (!window.confirm('Submit replacement request for this order?')) return;

    try {
      setSubmitting(true);
      await API.put(`/orders/${order._id}/replace`, { reason: reason.trim() });
      alert('Replacement request submitted');
      navigate(`/order/${order._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit replacement request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading..." />;

  if (!order) {
    return (
      <div className="container my-5 text-center">
        <h4>Order not found</h4>
        <Link to="/orders">Back to Orders</Link>
      </div>
    );
  }

  const alreadyRequested = !!order.replaceRequest?.requested;
  const delivered = (order.status || '').toLowerCase() === 'delivered' || !!order.isDelivered;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Replace Order</h2>
          <div className="text-muted">Order #{order._id?.slice(-8).toUpperCase()}</div>
        </div>
        <Link to={`/order/${order._id}`} className="btn btn-outline-secondary">Back</Link>
      </div>

      {!delivered && (
        <div className="alert alert-warning">
          Replacement can be requested only after the order is delivered.
        </div>
      )}

      {alreadyRequested && (
        <div className="alert alert-info">
          Replacement is already requested for this order.
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Replacement Request</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <textarea
              className="form-control"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you want to replace this order"
              disabled={!delivered || alreadyRequested || submitting}
            />
          </div>

          <Button
            title={submitting ? 'Submitting...' : 'Submit Replacement Request'}
            onClick={handleSubmit}
            className="btn-info"
            disabled={!delivered || alreadyRequested || submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default ReplaceOrder;
