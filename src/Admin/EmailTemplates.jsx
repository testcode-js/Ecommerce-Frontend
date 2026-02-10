import React, { useState } from 'react';
import { FaEnvelope, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './AdminLayout.css';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([
    { _id: '1', name: 'Welcome Email', subject: 'Welcome to Easy Shop!', type: 'welcome' },
    { _id: '2', name: 'Order Confirmation', subject: 'Order Confirmation', type: 'order' }
  ]);

  return (
    <div className="admin-dashboard">
      <h2 className="admin-page-title">Email Templates</h2>
      
      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">Email Templates</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template._id}>
                    <td>{template.name}</td>
                    <td>{template.subject}</td>
                    <td>
                      <span className="badge bg-info">{template.type}</span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-warning">
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplates;
