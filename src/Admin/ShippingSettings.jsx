import React, { useState } from 'react';
import { FaTruck, FaRupeeSign, FaSave } from 'react-icons/fa';
import './AdminLayout.css';

const ShippingSettings = () => {
  const [settings, setSettings] = useState({
    defaultZone: 'domestic',
    handlingFee: 50,
    freeShippingEnabled: true,
    freeShippingThreshold: 1000
  });

  const handleSave = () => {
    console.log('Save shipping settings:', settings);
  };

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Shipping Settings</h2>
        <button className="btn btn-primary-admin" onClick={handleSave}>
          <FaSave className="me-2" />
          Save Settings
        </button>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">Shipping Configuration</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Handling Fee</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  type="number"
                  className="form-control"
                  value={settings.handlingFee}
                  onChange={(e) => setSettings({...settings, handlingFee: parseFloat(e.target.value)})}
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

export default ShippingSettings;
