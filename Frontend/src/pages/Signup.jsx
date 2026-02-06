import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const { register, isAuthenticated, loading, error, clearError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      navigate('/');
    }
  };

  if (loading) return <Loading message="Creating account..." />;

  return (
    <section className='signup-section'>
      <div className='container my-5'>
        <div className='row justify-content-center align-items-center'>
          <div className='col-lg-5 col-md-7'>
            <div className='card shadow p-4'>
              <h4 className='text-center mb-4'>Create Account</h4>

              {(error || localError) && (
                <div className='alert alert-danger'>{error || localError}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='name' className='form-label'>Full Name</label>
                  <input
                    type='text'
                    name='name'
                    className='form-control'
                    id='name'
                    placeholder='Enter your full name'
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='mb-3'>
                  <label htmlFor='email' className='form-label'>Email Address</label>
                  <input
                    type='email'
                    name='email'
                    className='form-control'
                    id='email'
                    placeholder='Enter your email'
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <div className='form-text'>We'll never share your email with anyone else.</div>
                </div>

                <div className='mb-3'>
                  <label htmlFor='password' className='form-label'>Password</label>
                  <input
                    type='password'
                    name='password'
                    className='form-control'
                    id='password'
                    placeholder='Create a password (min 6 characters)'
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='mb-3'>
                  <label htmlFor='confirmPassword' className='form-label'>Confirm Password</label>
                  <input
                    type='password'
                    name='confirmPassword'
                    className='form-control'
                    id='confirmPassword'
                    placeholder='Confirm your password'
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type='submit' title='Sign Up' className='w-100' disabled={loading} />

                <p className='mt-3 text-center'>
                  Already have an account? <Link to='/login'>Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;