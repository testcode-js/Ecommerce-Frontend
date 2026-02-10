import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserShield, FaEnvelope, FaCalendar, FaSearch, FaFilter, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockUsers = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'customer',
          createdAt: '2024-01-15',
          isActive: true,
          orders: 5
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'customer',
          createdAt: '2024-01-20',
          isActive: true,
          orders: 3
        },
        {
          _id: '3',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: '2024-01-01',
          isActive: true,
          orders: 0
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Users Management</h2>
        <div className="d-flex gap-3">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">All Users ({filteredUsers.length})</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="admin-avatar me-3" style={{ width: '40px', height: '40px' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaEnvelope className="me-2 text-muted" />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        <FaUserShield className="me-1" />
                        {user.role}
                      </span>
                    </td>
                    <td>{user.orders}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaCalendar className="me-2 text-muted" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary">
                          <FaEye />
                        </button>
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

export default Users;
