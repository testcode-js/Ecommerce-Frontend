import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, loading, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    const result = await forgotPassword(email);
    if (result.success) {
      setSubmitted(true);
    }
  };

  if (loading) return <Loading message="Sending reset link..." />;

  if (submitted) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <div className="card shadow p-4 text-center" style={{ maxWidth: '450px', width: '100%' }}>
          <div className="mb-4">
            <FaEnvelope size={60} className="text-success" />
          </div>
          <h4 className="mb-3">Check Your Email</h4>
          <p className="text-muted mb-4">
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and click the link to reset your password.
          </p>
          <p className="text-muted small mb-4">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button title="Try Again" onClick={() => setSubmitted(false)} />
            <Link to="/login" className="btn btn-outline-secondary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow p-4" style={{ maxWidth: '450px', width: '100%' }}>
        <h3 className="text-center mb-3">Forgot Password?</h3>
        <p className="text-muted text-center mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">
              <FaEnvelope className="me-2" />
              Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" title="Send Reset Link" className="w-100 mb-3" disabled={loading} />

          <div className="text-center">
            <Link to="/login" className="text-muted">
              <FaArrowLeft className="me-2" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
