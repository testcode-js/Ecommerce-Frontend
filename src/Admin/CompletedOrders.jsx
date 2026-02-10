import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaUser, FaBox, FaRupeeSign, FaEye, FaStar } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    try {
      const mockOrders = [
        {
          _id: 'ORD007',
          user: { name: 'Eva Green', email: 'eva@example.com' },
          items: [
            { name: 'Laptop Pro', quantity: 1, price: 89999 }
          ],
          totalPrice: 89999,
          status: 'delivered',
          completedAt: '2024-01-13T16:45:00Z',
          rating: 5,
          review: 'Excellent product and fast delivery!'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
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
        <h2 className="admin-page-title">Completed Orders</h2>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">Completed Orders ({orders.length})</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user.name}</td>
                    <td>₹{order.totalPrice.toLocaleString()}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-1">{order.rating}</span>
                        <div className="text-warning">
                          {'★'.repeat(order.rating)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary">
                        <FaEye />
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

export default CompletedOrders;
