import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaBell, 
  FaLock, 
  FaCreditCard, 
  FaMapMarkerAlt, 
  FaPalette, 
  FaLanguage, 
  FaMoon, 
  FaSun,
  FaCog,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaTrash,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaDownload,
  FaUpload
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Settings = () => {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('account');
  
  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    avatar: ''
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    newsletter: true,
    priceDrops: true,
    backInStock: true,
    reviewReminders: true
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDataCollection: true,
    allowMarketing: false,
    twoFactorAuth: false
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    currency: 'INR',
    dateFormat: 'dd/mm/yyyy',
    itemsPerPage: 12
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    defaultPaymentMethod: '',
    savedCards: [],
    billingAddress: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    }
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      setAccountSettings({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setLoading(true);
      const fullName = `${accountSettings.firstName} ${accountSettings.lastName}`.trim();
      const { data } = await API.put('/users/profile', {
        ...accountSettings,
        name: fullName
      });
      updateUserData(data);
      setMessage({ type: 'success', text: 'Account settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to update account' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'danger', text: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      await API.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      setLoading(true);
      await API.put('/users/notifications', notificationSettings);
      setMessage({ type: 'success', text: 'Notification preferences updated!' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update notifications' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    try {
      setLoading(true);
      await API.put('/users/privacy', privacySettings);
      setMessage({ type: 'success', text: 'Privacy settings updated!' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update privacy settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await API.delete('/users/account');
      // Redirect to home after successful deletion
      window.location.href = '/';
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to delete account' });
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/users/export-data');
      // Create and download file
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `user_data_${user._id}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to export data' });
    } finally {
      setLoading(false);
    }
  };

  const renderAccountTab = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaUser className="me-2" />
          Account Settings
        </h5>
      </div>
      <div className="card-body">
        {message.text && (
          <div className={`alert alert-${message.type} alert-dismissible`}>
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })} />
          </div>
        )}
        
        <form onSubmit={handleAccountUpdate}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                value={accountSettings.firstName}
                onChange={(e) => setAccountSettings({...accountSettings, firstName: e.target.value})}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={accountSettings.lastName}
                onChange={(e) => setAccountSettings({...accountSettings, lastName: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={accountSettings.email}
              onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
              disabled
            />
            <small className="text-muted">Contact support to change email</small>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={accountSettings.phone}
              onChange={(e) => setAccountSettings({...accountSettings, phone: e.target.value})}
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              rows="3"
              value={accountSettings.bio}
              onChange={(e) => setAccountSettings({...accountSettings, bio: e.target.value})}
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <Button type="submit" title={<><FaSave className="me-2" />Save Changes</>} disabled={loading} />
        </form>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaBell className="me-2" />
          Notification Preferences
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h6 className="mb-3">Email Notifications</h6>
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="emailNotifications"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="emailNotifications">
              Enable email notifications
            </label>
          </div>
          
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="orderUpdates"
              checked={notificationSettings.orderUpdates}
              onChange={(e) => setNotificationSettings({...notificationSettings, orderUpdates: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="orderUpdates">
              Order updates and shipping notifications
            </label>
          </div>
          
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="promotionalEmails"
              checked={notificationSettings.promotionalEmails}
              onChange={(e) => setNotificationSettings({...notificationSettings, promotionalEmails: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="promotionalEmails">
              Promotional emails and offers
            </label>
          </div>
          
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="newsletter"
              checked={notificationSettings.newsletter}
              onChange={(e) => setNotificationSettings({...notificationSettings, newsletter: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="newsletter">
              Weekly newsletter
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <h6 className="mb-3">Product Notifications</h6>
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="priceDrops"
              checked={notificationSettings.priceDrops}
              onChange={(e) => setNotificationSettings({...notificationSettings, priceDrops: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="priceDrops">
              Price drop alerts for wishlist items
            </label>
          </div>
          
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="backInStock"
              checked={notificationSettings.backInStock}
              onChange={(e) => setNotificationSettings({...notificationSettings, backInStock: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="backInStock">
              Back in stock notifications
            </label>
          </div>
          
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="reviewReminders"
              checked={notificationSettings.reviewReminders}
              onChange={(e) => setNotificationSettings({...notificationSettings, reviewReminders: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="reviewReminders">
              Review reminders after purchase
            </label>
          </div>
        </div>
        
        <Button title="Save Notification Settings" onClick={handleNotificationUpdate} disabled={loading} />
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaShieldAlt className="me-2" />
          Privacy & Security
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h6 className="mb-3">Profile Privacy</h6>
          <div className="mb-3">
            <label className="form-label">Profile Visibility</label>
            <select
              className="form-select"
              value={privacySettings.profileVisibility}
              onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="showEmail"
              checked={privacySettings.showEmail}
              onChange={(e) => setPrivacySettings({...privacySettings, showEmail: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="showEmail">
              Show email in profile
            </label>
          </div>
          
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPhone"
              checked={privacySettings.showPhone}
              onChange={(e) => setPrivacySettings({...privacySettings, showPhone: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="showPhone">
              Show phone number in profile
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <h6 className="mb-3">Data & Marketing</h6>
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="allowDataCollection"
              checked={privacySettings.allowDataCollection}
              onChange={(e) => setPrivacySettings({...privacySettings, allowDataCollection: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="allowDataCollection">
              Allow data collection for improving services
            </label>
          </div>
          
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="allowMarketing"
              checked={privacySettings.allowMarketing}
              onChange={(e) => setPrivacySettings({...privacySettings, allowMarketing: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="allowMarketing">
              Allow marketing communications
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <h6 className="mb-3">Security</h6>
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="twoFactorAuth"
              checked={privacySettings.twoFactorAuth}
              onChange={(e) => setPrivacySettings({...privacySettings, twoFactorAuth: e.target.checked})}
            />
            <label className="form-check-label" htmlFor="twoFactorAuth">
              Enable two-factor authentication
            </label>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <Button title="Save Privacy Settings" onClick={handlePrivacyUpdate} disabled={loading} />
          <Button title="Change Password" onClick={() => setShowPasswordForm(!showPasswordForm)} className="btn-outline-warning" />
        </div>
      </div>
    </div>
  );

  if (!user) return <Loading message="Loading settings..." />;

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <FaCog className="me-2" />
        Settings
      </h2>

      {/* Password Modal */}
      {showPasswordForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Change Password</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <Button type="submit" title="Change Password" disabled={loading} />
                <Button title="Cancel" onClick={() => setShowPasswordForm(false)} className="btn-outline-secondary" />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card mb-4">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                <FaUser className="me-2" />
                Account
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell className="me-2" />
                Notifications
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'privacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                <FaShieldAlt className="me-2" />
                Privacy
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'account' && renderAccountTab()}
      {activeTab === 'notifications' && renderNotificationsTab()}
      {activeTab === 'privacy' && renderPrivacyTab()}

      {/* Danger Zone */}
      <div className="card border-danger">
        <div className="card-header bg-danger text-white">
          <h5 className="mb-0">
            <FaTrash className="me-2" />
            Danger Zone
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Export Your Data</h6>
              <p className="text-muted small mb-3">Download a copy of all your data including orders, profile information, and preferences.</p>
              <Button title={<><FaDownload className="me-2" />Export Data</>} onClick={handleExportData} disabled={loading} />
            </div>
            <div className="col-md-6">
              <h6>Delete Account</h6>
              <p className="text-muted small mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
              <Button title={<><FaTrash className="me-2" />Delete Account</>} onClick={() => setShowDeleteModal(true)} className="btn-danger" />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="card border-danger mt-3">
          <div className="card-body">
            <h6 className="text-danger mb-3">Are you sure you want to delete your account?</h6>
            <p className="text-muted mb-3">This action cannot be undone and will permanently delete:</p>
            <ul className="text-muted mb-3">
              <li>Your profile and personal information</li>
              <li>Order history and purchase records</li>
              <li>Wishlist and saved items</li>
              <li>Payment methods and addresses</li>
            </ul>
            <div className="d-flex gap-2">
              <Button title="Yes, Delete My Account" onClick={handleDeleteAccount} className="btn-danger" disabled={loading} />
              <Button title="Cancel" onClick={() => setShowDeleteModal(false)} className="btn-outline-secondary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
