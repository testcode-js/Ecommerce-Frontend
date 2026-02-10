import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaMapMarkerAlt, 
  FaSave, 
  FaPhone, 
  FaHistory,
  FaHeart,
  FaShoppingCart,
  FaBox,
  FaEdit,
  FaCamera,
  FaShieldAlt,
  FaCreditCard,
  FaChartLine,
  FaUserCircle,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaPlus,
  FaTrash,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';
import CloudinaryUpload from '../components/CloudinaryUpload';
import useCloudinary from '../hooks/useCloudinary';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, updateUserData, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    cartItems: 0,
    savedMoney: 0,
    memberSince: ''
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: true
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsletter: true,
    orderUpdates: true,
    priceDrops: false,
    newProducts: true
  });

  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  
  const { uploadUserAvatar } = useCloudinary();

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

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    const id = trackOrderId.trim();
    if (!id) return;
    setTrackOrderId('');
    navigate(`/order/${id}`);
  };

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

  const handleAvatarUpload = async (result) => {
    try {
      setLoading(true);
      const avatarUrl = result.data.url;
      
      // Update user profile with new avatar
      const { data } = await API.put('/users/profile', { avatar: avatarUrl });
      updateUserData(data);
      
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });
      setShowAvatarUpload(false);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update avatar' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUploadError = (error) => {
    setMessage({ type: 'danger', text: `Upload failed: ${error}` });
    setShowAvatarUpload(false);
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
        {/* Quick Actions */}
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaCog className="me-2" />
                Account Options
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <Link to="/orders" className="btn btn-outline-primary w-100">
                    <FaHistory className="me-2" />
                    My Orders
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/dashboard" className="btn btn-outline-secondary w-100">
                    <FaChartLine className="me-2" />
                    Dashboard
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/settings" className="btn btn-outline-success w-100">
                    <FaCog className="me-2" />
                    Settings
                  </Link>
                </div>
                <div className="col-md-3">
                  <button type="button" className="btn btn-outline-danger w-100" onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>
                </div>

                <div className="col-12">
                  <form onSubmit={handleTrackOrder} className="row g-2 align-items-end">
                    <div className="col-md-9">
                      <label className="form-label mb-1">
                        <FaBox className="me-2" />
                        Track Order
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Order ID (e.g. 65f... )"
                        value={trackOrderId}
                        onChange={(e) => setTrackOrderId(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <button type="submit" className="btn btn-primary w-100" disabled={!trackOrderId.trim()}>
                        Track
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              {/* Avatar Upload Section */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=0d6efd&color=fff&size=128`}
                    alt="Profile Avatar"
                    className="rounded-circle"
                    style={{ width: '128px', height: '128px', objectFit: 'cover', border: '4px solid #0d6efd' }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle"
                    onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                    style={{ width: '36px', height: '36px' }}
                  >
                    <FaCamera />
                  </button>
                </div>
                <p className="mt-2 mb-0 text-muted">Click camera to change avatar</p>
              </div>

              {/* Avatar Upload Component */}
              {showAvatarUpload && (
                <div className="mb-4 p-3 border rounded">
                  <h6 className="mb-3">Upload New Avatar</h6>
                  <CloudinaryUpload
                    onUploadSuccess={handleAvatarUpload}
                    onUploadError={handleAvatarUploadError}
                    multiple={false}
                    accept="image/*"
                    maxSize={2 * 1024 * 1024} // 2MB
                    folder={`ecommerce/users/${user._id}/avatar`}
                    buttonText="Choose Avatar"
                    showPreview={true}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm mt-2"
                    onClick={() => setShowAvatarUpload(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}

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
