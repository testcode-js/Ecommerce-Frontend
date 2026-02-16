import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const ReturnOrder = () => {
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
      alert('Please enter a return reason');
      return;
    }

    if (!window.confirm('Submit return request for this order?')) return;

    try {
      setSubmitting(true);
      await API.put(`/orders/${order._id}/return`, { reason: reason.trim() });
      alert('Return request submitted');
      navigate(`/order/${order._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit return request');
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

  const alreadyRequested = !!order.returnRequest?.requested;
  const delivered = (order.status || '').toLowerCase() === 'delivered' || !!order.isDelivered;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Return Order</h2>
          <div className="text-muted">Order #{order._id?.slice(-8).toUpperCase()}</div>
        </div>
        <Link to={`/order/${order._id}`} className="btn btn-outline-secondary">Back</Link>
      </div>

      {!delivered && (
        <div className="alert alert-warning">
          Return can be requested only after the order is delivered.
        </div>
      )}

      {alreadyRequested && (
        <div className="alert alert-info">
          Return is already requested for this order.
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Return Request</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <textarea
              className="form-control"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you want to return this order"
              disabled={!delivered || alreadyRequested || submitting}
            />
          </div>

          <Button
            title={submitting ? 'Submitting...' : 'Submit Return Request'}
            onClick={handleSubmit}
            className="btn-warning"
            disabled={!delivered || alreadyRequested || submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default ReturnOrder;
