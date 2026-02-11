import React, { useState } from 'react';
import { FaCog, FaSave, FaBell, FaEnvelope, FaShieldAlt, FaPalette, FaGlobe } from 'react-icons/fa';
import './AdminLayout.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Easy Shop',
      siteDescription: 'Your one-stop shop for quality products',
      contactEmail: 'contact@easyshop.com',
      supportPhone: '+1-234-567-8900',
      address: '123 Main St, City, State 12345'
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      newsletterEnabled: true,
      promotionalEmails: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordMinLength: '8',
      requireStrongPassword: true
    },
    appearance: {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      darkMode: false,
      compactMode: false
    }
  });

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FaCog },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'appearance', label: 'Appearance', icon: FaPalette }
  ];

  return (
    <div className="admin-dashboard">
      <h2 className="admin-page-title">Settings</h2>
      
      <div className="row">
        <div className="col-lg-3">
          <div className="admin-card">
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`list-group-item list-group-item-action border-0 ${
                      activeTab === tab.id ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: activeTab === tab.id 
                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                        : 'transparent',
                      borderLeft: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
                      color: activeTab === tab.id ? '#667eea' : 'inherit'
                    }}
                  >
                    <tab.icon className="me-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-9">
          <div className="admin-card">
            <div className="card-header">
              <h5 className="mb-0">
                {tabs.find(tab => tab.id === activeTab)?.icon && 
                  React.createElement(tabs.find(tab => tab.id === activeTab)?.icon, { className: 'me-2' })
                }
                {tabs.find(tab => tab.id === activeTab)?.label} Settings
              </h5>
            </div>
            <div className="card-body">
              {activeTab === 'general' && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Site Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.general.siteName}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, siteName: e.target.value }
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={settings.general.contactEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, contactEmail: e.target.value }
                      })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Site Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={settings.general.siteDescription}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, siteDescription: e.target.value }
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Support Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={settings.general.supportPhone}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, supportPhone: e.target.value }
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.general.address}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, address: e.target.value }
                      })}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div className="form-check form-switch" key={key}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={key}
                        checked={value}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [key]: e.target.checked }
                        })}
                      />
                      <label className="form-check-label" htmlFor={key}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: e.target.value }
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Minimum Password Length</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, passwordMinLength: e.target.value }
                      })}
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="twoFactor"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, twoFactorAuth: e.target.checked }
                        })}
                      />
                      <label className="form-check-label" htmlFor="twoFactor">
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="strongPassword"
                        checked={settings.security.requireStrongPassword}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, requireStrongPassword: e.target.checked }
                        })}
                      />
                      <label className="form-check-label" htmlFor="strongPassword">
                        Require Strong Passwords
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Primary Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, primaryColor: e.target.value }
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Secondary Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, secondaryColor: e.target.value }
                      })}
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="darkMode"
                        checked={settings.appearance.darkMode}
                        onChange={(e) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, darkMode: e.target.checked }
                        })}
                      />
                      <label className="form-check-label" htmlFor="darkMode">
                        Enable Dark Mode (Legacy)
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="compactMode"
                        checked={settings.appearance.compactMode}
                        onChange={(e) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, compactMode: e.target.checked }
                        })}
                      />
                      <label className="form-check-label" htmlFor="compactMode">
                        Compact Mode
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <button className="btn btn-primary-admin" onClick={handleSave}>
                  <FaSave className="me-2" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
