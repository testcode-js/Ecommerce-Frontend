import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAdmin, isAuthenticated, loading, error, clearError } = useAuth();

  // Handle redirect after login based on user role
  useEffect(() => {
    if (isAuthenticated && user) {
      // If there's a saved location, go there
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      
      // Otherwise redirect based on role
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, isAdmin, navigate, location.state]);

  useEffect(() => {
    return () => clearError();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!form.email || !form.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const result = await login(form.email, form.password);
    // Don't navigate here - let the useEffect handle it
    // so we can check if user is admin or not
  };

  if (loading) return <Loading message="Logging in..." />;

  return (
    <div className='d-flex align-items-center justify-content-center' style={{ minHeight: '80vh' }}>
      <div className='card shadow p-4' style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className='text-center mb-4'>Login</h2>
        
        {(error || localError) && (
          <div className="alert alert-danger">{error || localError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='form-label'>Email</label>
            <input
              type='email'
              name='email'
              className='form-control'
              placeholder='Enter your email'
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='mb-3'>
            <label className='form-label'>Password</label>
            <input
              type='password'
              name='password'
              className='form-control'
              placeholder='Enter your password'
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className='mb-3 text-end'>
            <Link to='/forgot-password' className='text-muted small'>
              Forgot Password?
            </Link>
          </div>

          <Button type='submit' title='Login' className='w-100' disabled={loading} />

          <p className='mt-3 text-center'>
            Don't have an account? <Link to='/signup'>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
