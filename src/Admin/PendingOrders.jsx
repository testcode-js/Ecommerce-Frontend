import React, { useState, useEffect } from 'react';
import { FaClock, FaUser, FaBox, FaRupeeSign, FaEye, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      // Mock data for pending orders
      const mockOrders = [
        {
          _id: 'ORD001',
          user: { name: 'John Doe', email: 'john@example.com' },
          items: [
            { name: 'Laptop Pro', quantity: 1, price: 89999 },
            { name: 'Wireless Mouse', quantity: 2, price: 1299 }
          ],
          totalPrice: 92597,
          status: 'pending',
          createdAt: '2024-01-15T10:30:00Z',
          paymentMethod: 'credit_card',
          shippingAddress: '123 Main St, City, State 12345'
        },
        {
          _id: 'ORD002',
          user: { name: 'Jane Smith', email: 'jane@example.com' },
          items: [
            { name: 'Gaming Keyboard', quantity: 1, price: 4999 },
            { name: 'Monitor 4K', quantity: 1, price: 24999 }
          ],
          totalPrice: 29998,
          status: 'pending',
          createdAt: '2024-01-15T14:20:00Z',
          paymentMethod: 'paypal',
          shippingAddress: '456 Oak Ave, Town, State 67890'
        },
        {
          _id: 'ORD003',
          user: { name: 'Bob Johnson', email: 'bob@example.com' },
          items: [
            { name: 'Headphones Pro', quantity: 1, price: 7999 },
            { name: 'Phone Case', quantity: 1, price: 499 }
          ],
          totalPrice: 8498,
          status: 'pending',
          createdAt: '2024-01-15T16:45:00Z',
          paymentMethod: 'debit_card',
          shippingAddress: '789 Pine Rd, Village, State 13579'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveOrder = (orderId) => {
    console.log('Approve order:', orderId);
    // API call to approve order
  };

  const handleRejectOrder = (orderId) => {
    console.log('Reject order:', orderId);
    // API call to reject order
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Pending Orders</h2>
        <div className="d-flex gap-3">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card warning">
            <h6 className="text-muted mb-2">Pending Orders</h6>
            <h3 className="mb-0">{orders.length}</h3>
            <small className="text-warning">Awaiting approval</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card info">
            <h6 className="text-muted mb-2">Total Value</h6>
            <h3 className="mb-0">₹{orders.reduce((acc, order) => acc + order.totalPrice, 0).toLocaleString()}</h3>
            <small className="text-success">Revenue pending</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card primary">
            <h6 className="text-muted mb-2">Avg Order Value</h6>
            <h3 className="mb-0">₹{(orders.reduce((acc, order) => acc + order.totalPrice, 0) / orders.length).toLocaleString()}</h3>
            <small className="text-warning">Average amount</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card success">
            <h6 className="text-muted mb-2">Items to Process</h6>
            <h3 className="mb-0">{orders.reduce((acc, order) => acc + order.items.length, 0)}</h3>
            <small className="text-info">Total items</small>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">Pending Orders ({filteredOrders.length})</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="order-icon me-2" style={{ 
                          width: '32px', 
                          height: '32px',
                          background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <FaClock />
                        </div>
                        <div>
                          <div className="fw-semibold">{order._id}</div>
                          <small className="text-muted">Pending</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{order.user.name}</div>
                        <small className="text-muted">{order.user.email}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{order.items.length} items</div>
                        <small className="text-muted">
                          {order.items.map(item => `${item.name}(${item.quantity})`).join(', ')}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaRupeeSign className="text-muted me-1" />
                        <span className="fw-semibold">{order.totalPrice.toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${order.paymentMethod === 'credit_card' ? 'bg-primary' : order.paymentMethod === 'paypal' ? 'bg-info' : 'bg-secondary'}`}>
                        {order.paymentMethod.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleApproveOrder(order._id)}>
                          <FaCheck />
                        </button>
                        <button className="btn btn-sm btn-outline-primary">
                          <FaEye />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRejectOrder(order._id)}>
                          <FaTimes />
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

export default PendingOrders;
