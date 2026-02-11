import React, { useState, useEffect } from 'react';
import { FiX, FiLock, FiShield } from 'react-icons/fi';
import paymentService from '../services/paymentService';

const initialForm = {
  cardNumber: '',
  cardHolder: '',
  expiry: '',
  cvv: '',
  upiId: '',
};

const FakePaymentModal = ({ open, amount, method, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState('details');
  const [session, setSession] = useState(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setStep('details');
      setSession(null);
      setOtp('');
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        amount,
        method,
      };

      if (method === 'Card') {
        payload.cardNumber = form.cardNumber;
        payload.cardHolder = form.cardHolder;
        payload.expiry = form.expiry;
        payload.cvv = form.cvv;
      }

      if (method === 'UPI') {
        payload.upiId = form.upiId;
      }

      const { session: paymentSession, paymentResult } = await paymentService.initiatePayment(payload);
      setSession(paymentSession);

      if (paymentResult) {
        setStep('success');
        onSuccess(paymentResult);
      } else if (paymentSession.requiresOtp) {
        setStep('otp');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;

    setError('');
    setLoading(true);

    try {
      const { paymentResult } = await paymentService.confirmPayment({
        sessionId: session.id,
        otp,
      });
      setStep('success');
      onSuccess(paymentResult);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid OTP, please try again');
    } finally {
      setLoading(false);
    }
  };

  const renderDetailsForm = () => {
    if (method === 'Card') {
      return (
        <form onSubmit={handleDetailsSubmit} className="payment-form">
          <div className="mb-3">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              className="form-control"
              placeholder="1234 5678 9012 3456"
              value={form.cardNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Card Holder Name</label>
            <input
              type="text"
              name="cardHolder"
              className="form-control"
              placeholder="Name on card"
              value={form.cardHolder}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Expiry (MM/YY)</label>
              <input
                type="text"
                name="expiry"
                className="form-control"
                placeholder="08/28"
                value={form.expiry}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">CVV</label>
              <input
                type="password"
                name="cvv"
                className="form-control"
                placeholder="123"
                value={form.cvv}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleDetailsSubmit} className="payment-form">
        <div className="mb-3">
          <label className="form-label">UPI ID</label>
          <input
            type="text"
            name="upiId"
            className="form-control"
            placeholder="username@bank"
            value={form.upiId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
        </button>
      </form>
    );
  };

  return (
    <div className="payment-modal-backdrop">
      <div className="payment-modal">
        <button className="payment-modal-close" onClick={onClose} disabled={loading}>
          <FiX size={20} />
        </button>

        <div className="payment-modal-header">
          <FiShield className="me-2" />
          <div>
            <h5 className="mb-0">Secure {method} Payment</h5>
            <small>Amount: ₹{amount.toLocaleString()}</small>
          </div>
        </div>

        <div className="payment-modal-body">
          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

          {step === 'details' && renderDetailsForm()}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="payment-form">
              <div className="text-center mb-3">
                <FiLock size={32} className="text-primary mb-2" />
                <p className="mb-1">Enter the 6-digit OTP sent to your phone</p>
                {session?.otpHint && (
                  <small className="text-muted">Test OTP: {session.otpHint}</small>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control text-center fs-4"
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Pay'}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="payment-success-icon mb-3">✓</div>
              <h5 className="mb-2">Payment Successful</h5>
              <p className="text-muted mb-4">Redirecting you back to checkout...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FakePaymentModal;
