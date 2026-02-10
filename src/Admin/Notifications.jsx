import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaPaperPlane, FaTrash, FaPlus } from 'react-icons/fa';
import './AdminLayout.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { _id: '1', title: 'New Order Received', message: 'Order #ORD123 has been placed', type: 'success', target: 'admin' },
    { _id: '2', title: 'Low Stock Alert', message: 'Product "Laptop Pro" is running low', type: 'warning', target: 'admin' }
  ]);

  return (
    <div className="admin-dashboard">
      <h2 className="admin-page-title">Notifications</h2>
      
      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">Recent Notifications</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification._id}>
                    <td>
                      <span className={`badge bg-${notification.type}`}>
                        {notification.type}
                      </span>
                    </td>
                    <td>{notification.title}</td>
                    <td>{notification.message}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger">
                        <FaTrash />
                      </button>
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

export default Notifications;
