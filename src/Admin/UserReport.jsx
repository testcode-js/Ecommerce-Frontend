import React, { useState } from 'react';
import { FaUsers, FaDownload, FaUserShield, FaEnvelope, FaCalendarAlt, FaShoppingCart, FaRupeeSign } from 'react-icons/fa';
import { downloadReport, formatCurrency, formatDate, formatDateTime } from '../utils/downloadUtils';
import './AdminLayout.css';

const UserReport = () => {
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('joinDate');

  // Enhanced user data with more details
  const [userData] = useState([
    {
      id: 'USR001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'customer',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-15T10:30:00Z',
      totalOrders: 5,
      totalSpent: 45997,
      avgOrderValue: 9199.4,
      status: 'active',
      location: 'Mumbai, Maharashtra',
      phone: '+91 98765 43210',
      verified: true,
      newsletter: true,
      loyaltyPoints: 450,
      referralCount: 3
    },
    {
      id: 'USR002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'customer',
      joinDate: '2024-01-11',
      lastLogin: '2024-01-14T15:45:00Z',
      totalOrders: 3,
      totalSpent: 29997,
      avgOrderValue: 9999,
      status: 'active',
      location: 'Delhi, NCR',
      phone: '+91 87654 32109',
      verified: true,
      newsletter: false,
      loyaltyPoints: 300,
      referralCount: 1
    },
    {
      id: 'USR003',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'customer',
      joinDate: '2024-01-12',
      lastLogin: '2024-01-13T09:20:00Z',
      totalOrders: 8,
      totalSpent: 79992,
      avgOrderValue: 9999,
      status: 'active',
      location: 'Bangalore, Karnataka',
      phone: '+91 76543 21098',
      verified: false,
      newsletter: true,
      loyaltyPoints: 800,
      referralCount: 5
    },
    {
      id: 'USR004',
      name: 'Alice Wilson',
      email: 'alice.wilson@example.com',
      role: 'customer',
      joinDate: '2024-01-13',
      lastLogin: '2024-01-15T14:10:00Z',
      totalOrders: 2,
      totalSpent: 19998,
      avgOrderValue: 9999,
      status: 'inactive',
      location: 'Chennai, Tamil Nadu',
      phone: '+91 65432 10987',
      verified: true,
      newsletter: false,
      loyaltyPoints: 200,
      referralCount: 0
    },
    {
      id: 'USR005',
      name: 'Admin User',
      email: 'admin@easyshop.com',
      role: 'admin',
      joinDate: '2024-01-01',
      lastLogin: '2024-01-15T16:00:00Z',
      totalOrders: 0,
      totalSpent: 0,
      avgOrderValue: 0,
      status: 'active',
      location: 'Pune, Maharashtra',
      phone: '+91 54321 09876',
      verified: true,
      newsletter: true,
      loyaltyPoints: 0,
      referralCount: 10
    },
    {
      id: 'USR006',
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'customer',
      joinDate: '2024-01-14',
      lastLogin: '2024-01-14T11:30:00Z',
      totalOrders: 1,
      totalSpent: 8999,
      avgOrderValue: 8999,
      status: 'active',
      location: 'Hyderabad, Telangana',
      phone: '+91 43210 98765',
      verified: true,
      newsletter: true,
      loyaltyPoints: 100,
      referralCount: 2
    }
  ]);

  // Monthly user growth data
  const [monthlyGrowth] = useState([
    { month: 'November', total: 980, new: 89, active: 756, returning: 224, churned: 12 },
    { month: 'December', total: 1020, new: 102, active: 823, returning: 197, churned: 15 },
    { month: 'January', total: 1089, new: 123, active: 856, returning: 233, churned: 18 }
  ]);

  // Filter and sort users
  const filteredUsers = userData.filter(user => 
    filterRole === 'all' || user.role === filterRole
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'joinDate': return new Date(b.joinDate) - new Date(a.joinDate);
      case 'totalSpent': return b.totalSpent - a.totalSpent;
      case 'totalOrders': return b.totalOrders - a.totalOrders;
      default: return 0;
    }
  });

  // Calculate totals
  const totalUsers = userData.length;
  const totalCustomers = userData.filter(u => u.role === 'customer').length;
  const totalAdmins = userData.filter(u => u.role === 'admin').length;
  const activeUsers = userData.filter(u => u.status === 'active').length;
  const verifiedUsers = userData.filter(u => u.verified).length;
  const totalSpent = userData.reduce((acc, u) => acc + u.totalSpent, 0);
  const totalOrders = userData.reduce((acc, u) => acc + u.totalOrders, 0);
  const avgSpent = totalUsers > 0 ? totalSpent / totalUsers : 0;
  const newsletterSubscribers = userData.filter(u => u.newsletter).length;
  const totalLoyaltyPoints = userData.reduce((acc, u) => acc + u.loyaltyPoints, 0);

  const handleDownload = (format) => {
    const headers = ['id', 'name', 'email', 'role', 'joinDate', 'lastLogin', 'totalOrders', 'totalSpent', 'avgOrderValue', 'status', 'location', 'phone', 'verified', 'newsletter', 'loyaltyPoints', 'referralCount'];
    const downloadData = sortedUsers.map(user => ({
      ...user,
      totalSpent: formatCurrency(user.totalSpent),
      avgOrderValue: formatCurrency(user.avgOrderValue),
      joinDate: formatDate(user.joinDate),
      lastLogin: formatDateTime(user.lastLogin),
      verified: user.verified ? 'Yes' : 'No',
      newsletter: user.newsletter ? 'Yes' : 'No'
    }));

    downloadReport(
      downloadData,
      `user-report-${filterRole}-${formatDate(new Date())}`,
      format,
      'User Report',
      headers
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">User Report</h2>
        <div className="d-flex gap-3">
          <select 
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{ maxWidth: '120px' }}
          >
            <option value="all">All Users</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
          <select 
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="joinDate">Sort by Join Date</option>
            <option value="name">Sort by Name</option>
            <option value="totalSpent">Sort by Spent</option>
            <option value="totalOrders">Sort by Orders</option>
          </select>
          <div className="btn-group">
            <button 
              className="btn btn-outline-primary" 
              onClick={() => handleDownload('csv')}
              title="Download as CSV"
            >
              <FaDownload /> CSV
            </button>
            <button 
              className="btn btn-outline-success" 
              onClick={() => handleDownload('excel')}
              title="Download as Excel"
            >
              <FaDownload /> Excel
            </button>
            <button 
              className="btn btn-danger" 
              onClick={() => handleDownload('pdf')}
              title="Download as PDF"
            >
              <FaDownload /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card primary">
            <h6 className="text-muted mb-2">Total Users</h6>
            <h3 className="mb-0">{totalUsers.toLocaleString()}</h3>
            <small className="text-success">+{monthlyGrowth[2].new} new this month</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card success">
            <h6 className="text-muted mb-2">Active Users</h6>
            <h3 className="mb-0">{activeUsers.toLocaleString()}</h3>
            <small className="text-info">{((activeUsers / totalUsers) * 100).toFixed(1)}% of total</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card info">
            <h6 className="text-muted mb-2">Total Spent</h6>
            <h3 className="mb-0">{formatCurrency(totalSpent)}</h3>
            <small className="text-success">+22.3% vs last month</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card warning">
            <h6 className="text-muted mb-2">Avg Spent/User</h6>
            <h3 className="mb-0">{formatCurrency(avgSpent)}</h3>
            <small className="text-warning">Per user average</small>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Verified Users</h6>
            <h3 className="mb-0">{verifiedUsers}</h3>
            <small className="text-success">Email verified</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Newsletter Subs</h6>
            <h3 className="mb-0">{newsletterSubscribers}</h3>
            <small className="text-info">Marketing opt-in</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Loyalty Points</h6>
            <h3 className="mb-0">{totalLoyaltyPoints.toLocaleString()}</h3>
            <small className="text-warning">Total points issued</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Total Orders</h6>
            <h3 className="mb-0">{totalOrders}</h3>
            <small className="text-success">All user orders</small>
          </div>
        </div>
      </div>

      {/* User Growth Table */}
      <div className="admin-card mb-4">
        <div className="card-header">
          <h5 className="mb-0">User Growth Trend</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Users</th>
                  <th>New Users</th>
                  <th>Active Users</th>
                  <th>Returning Users</th>
                  <th>Churned Users</th>
                  <th>Growth Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlyGrowth.map((month, index) => {
                  const prevMonth = index > 0 ? monthlyGrowth[index - 1] : null;
                  const growthRate = prevMonth ? ((month.total - prevMonth.total) / prevMonth.total * 100) : 0;
                  
                  return (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-muted" />
                          {month.month}
                        </div>
                      </td>
                      <td>{month.total.toLocaleString()}</td>
                      <td>
                        <span className="badge bg-success">+{month.new}</span>
                      </td>
                      <td>{month.active.toLocaleString()}</td>
                      <td>{month.returning}</td>
                      <td>
                        <span className="badge bg-danger">-{month.churned}</span>
                      </td>
                      <td>
                        <span className={`badge ${growthRate > 5 ? 'bg-success' : growthRate > 0 ? 'bg-primary' : 'bg-secondary'}`}>
                          +{growthRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced User Table */}
      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">User Details ({sortedUsers.length})</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Join Date</th>
                  <th>Total Orders</th>
                  <th>Total Spent</th>
                  <th>Avg Order</th>
                  <th>Status</th>
                  <th>Loyalty Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <div className="d-flex align-items-center">
                          <div className="user-avatar me-2" style={{ 
                            width: '32px', 
                            height: '32px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold">{user.name}</div>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        <FaUserShield className="me-1" />
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="me-2 text-muted" />
                        {formatDate(user.joinDate)}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaShoppingCart className="me-2 text-muted" />
                        {user.totalOrders}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaRupeeSign className="text-muted me-1" />
                        <span className="fw-semibold">{(user.totalSpent / 1000).toFixed(1)}K</span>
                      </div>
                    </td>
                    <td>{formatCurrency(user.avgOrderValue)}</td>
                    <td>
                      <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info">{user.loyaltyPoints}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary">
                        <FaEnvelope />
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

export default UserReport;
