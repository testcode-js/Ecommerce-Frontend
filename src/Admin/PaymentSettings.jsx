import React, { useState } from 'react';
import { FaCreditCard, FaRupeeSign, FaSave } from 'react-icons/fa';
import './AdminLayout.css';

const PaymentSettings = () => {
  const [settings, setSettings] = useState({
    currency: 'INR',
    taxRate: 18,
    shippingFee: 100,
    freeShippingThreshold: 1000
  });

  const handleSave = () => {
    console.log('Save payment settings:', settings);
  };

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Payment Settings</h2>
        <button className="btn btn-primary-admin" onClick={handleSave}>
          <FaSave className="me-2" />
          Save Settings
        </button>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">Payment Configuration</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Currency</label>
              <select 
                className="form-select"
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Tax Rate (%)</label>
              <input
                type="number"
                className="form-control"
                value={settings.taxRate}
                onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Shipping Fee</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="number"
                  className="form-control"
                  value={settings.shippingFee}
                  onChange={(e) => setSettings({...settings, shippingFee: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Free Shipping Threshold</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="number"
                  className="form-control"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({...settings, freeShippingThreshold: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
