import React, { useState, useEffect } from 'react';
import { FaCog, FaUser, FaBox, FaRupeeSign, FaEye, FaCheck, FaSearch, FaTruck } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const ProcessingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProcessingOrders();
  }, []);

  const fetchProcessingOrders = async () => {
    try {
      const mockOrders = [
        {
          _id: 'ORD004',
          user: { name: 'Alice Wilson', email: 'alice@example.com' },
          items: [
            { name: 'Tablet Pro', quantity: 1, price: 49999 },
            { name: 'Stylus Pen', quantity: 2, price: 1999 }
          ],
          totalPrice: 53997,
          status: 'processing',
          createdAt: '2024-01-14T09:15:00Z',
          processingStarted: '2024-01-15T11:30:00Z',
          estimatedDelivery: '2024-01-18T00:00:00Z',
          trackingNumber: 'TRK123456789'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching processing orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Processing Orders</h2>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">Processing Orders ({orders.length})</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Tracking</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user.name}</td>
                    <td>₹{order.totalPrice.toLocaleString()}</td>
                    <td>{order.trackingNumber}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary">
                          <FaEye />
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

export default ProcessingOrders;
