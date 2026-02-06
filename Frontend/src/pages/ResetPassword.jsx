import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword, loading, error, clearError } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const result = await resetPassword(token, form.password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  if (loading) return <Loading message="Resetting password..." />;

  if (success) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <div className="card shadow p-4 text-center" style={{ maxWidth: '450px', width: '100%' }}>
          <div className="mb-4">
            <FaCheckCircle size={60} className="text-success" />
          </div>
          <h4 className="mb-3">Password Reset Successful!</h4>
          <p className="text-muted mb-4">
            Your password has been reset successfully. You will be redirected to the login page shortly.
          </p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow p-4" style={{ maxWidth: '450px', width: '100%' }}>
        <h3 className="text-center mb-3">
          <FaLock className="me-2" />
          Reset Password
        </h3>
        <p className="text-muted text-center mb-4">
          Enter your new password below.
        </p>

        {(error || localError) && <div className="alert alert-danger">{error || localError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="Enter new password (min 6 characters)"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control form-control-lg"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" title="Reset Password" className="w-100 mb-3" disabled={loading} />

          <div className="text-center">
            <Link to="/login" className="text-muted">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
