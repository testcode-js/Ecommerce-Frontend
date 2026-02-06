import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
      });

      if (user.addresses && user.addresses.length > 0) {
        setAddressForm(user.addresses[0]);
      }
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setLoading(true);
      const { data } = await API.put('/users/profile', profileForm);
      updateUserData(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'danger', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setLoading(true);
      await API.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setLoading(true);
      await API.post('/users/address', addressForm);
      setMessage({ type: 'success', text: 'Address saved successfully!' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save address' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loading message="Loading profile..." />;

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <FaUser className="me-2" />
        My Profile
      </h2>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible`}>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })} />
        </div>
      )}

      <div className="row">
        {/* Profile Info */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Personal Information
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    <FaEnvelope className="me-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" title={<><FaSave className="me-2" />Update Profile</>} disabled={loading} />
              </form>
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-warning">
              <h5 className="mb-0">
                <FaLock className="me-2" />
                Change Password
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" title={<><FaLock className="me-2" />Change Password</>} disabled={loading} />
              </form>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <FaMapMarkerAlt className="me-2" />
                Default Shipping Address
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddressUpdate}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Street Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  />
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" title={<><FaSave className="me-2" />Save Address</>} disabled={loading} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
