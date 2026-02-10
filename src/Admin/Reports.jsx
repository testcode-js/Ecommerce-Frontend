import React, { useState } from 'react';
import { FaChartPie, FaChartLine, FaBox, FaUsers, FaDollarSign, FaShoppingCart, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import './AdminLayout.css';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState('30days');

  const reports = [
    { id: 'sales', label: 'Sales Report', icon: FaChartLine },
    { id: 'products', label: 'Product Report', icon: FaBox },
    { id: 'users', label: 'User Report', icon: FaUsers }
  ];

  const mockData = {
    sales: {
      totalRevenue: 125430,
      totalOrders: 856,
      averageOrderValue: 146.50,
      growth: 12.5,
      chartData: [
        { month: 'Jan', revenue: 8500, orders: 65 },
        { month: 'Feb', revenue: 9200, orders: 72 },
        { month: 'Mar', revenue: 11800, orders: 89 },
        { month: 'Apr', revenue: 10500, orders: 78 },
        { month: 'May', revenue: 13200, orders: 95 },
        { month: 'Jun', revenue: 14800, orders: 108 }
      ]
    },
    products: {
      totalProducts: 245,
      lowStock: 12,
      topSelling: [
        { name: 'Product A', sales: 156, revenue: 15600 },
        { name: 'Product B', sales: 142, revenue: 14200 },
        { name: 'Product C', sales: 98, revenue: 9800 }
      ],
      categories: [
        { name: 'Electronics', count: 89, sales: 456 },
        { name: 'Clothing', count: 67, sales: 234 },
        { name: 'Books', count: 45, sales: 123 },
        { name: 'Home', count: 44, sales: 89 }
      ]
    },
    users: {
      totalUsers: 1234,
      newUsers: 89,
      activeUsers: 856,
      retention: 78.5,
      userGrowth: [
        { month: 'Jan', users: 980 },
        { month: 'Feb', users: 1020 },
        { month: 'Mar', users: 1089 },
        { month: 'Apr', users: 1156 },
        { month: 'May', users: 1198 },
        { month: 'Jun', users: 1234 }
      ]
    }
  };

  const currentData = mockData[activeReport];

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Reports & Analytics</h2>
        <div className="d-flex gap-3">
          <select 
            className="form-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="btn btn-primary-admin">
            <FaDownload className="me-2" />
            Export
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="admin-card mb-4">
        <div className="card-body p-0">
          <div className="d-flex">
            {reports.map((report) => (
              <button
                key={report.id}
                className={`flex-fill text-center py-3 border-0 ${
                  activeReport === report.id ? 'active' : ''
                }`}
                onClick={() => setActiveReport(report.id)}
                style={{
                  background: activeReport === report.id 
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                    : 'transparent',
                  borderBottom: activeReport === report.id ? '3px solid #667eea' : '3px solid transparent',
                  color: activeReport === report.id ? '#667eea' : 'inherit'
                }}
              >
                <report.icon className="me-2" />
                {report.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Report */}
      {activeReport === 'sales' && (
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="stat-card primary">
              <h6 className="text-muted mb-2">Total Revenue</h6>
              <h3 className="mb-0">${currentData.totalRevenue.toLocaleString()}</h3>
              <small className="text-success">+{currentData.growth}% growth</small>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="stat-card success">
              <h6 className="text-muted mb-2">Total Orders</h6>
              <h3 className="mb-0">{currentData.totalOrders}</h3>
              <small className="text-success">+8.2% from last period</small>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="stat-card info">
              <h6 className="text-muted mb-2">Avg Order Value</h6>
              <h3 className="mb-0">${currentData.averageOrderValue}</h3>
              <small className="text-warning">+2.1% increase</small>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="stat-card warning">
              <h6 className="text-muted mb-2">Conversion Rate</h6>
              <h3 className="mb-0">3.2%</h3>
              <small className="text-success">+0.5% improvement</small>
            </div>
          </div>

          <div className="col-12">
            <div className="admin-card">
              <div className="card-header">
                <h5 className="mb-0">Sales Trend</h5>
              </div>
              <div className="card-body">
                <div className="admin-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Revenue</th>
                        <th>Orders</th>
                        <th>Avg Order Value</th>
                        <th>Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.chartData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.month}</td>
                          <td>${item.revenue.toLocaleString()}</td>
                          <td>{item.orders}</td>
                          <td>${(item.revenue / item.orders).toFixed(2)}</td>
                          <td>
                            <span className="badge bg-success">
                              +{index > 0 ? ((item.revenue / currentData.chartData[index - 1].revenue - 1) * 100).toFixed(1) : 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Report */}
      {activeReport === 'products' && (
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="stat-card primary">
              <h6 className="text-muted mb-2">Total Products</h6>
              <h3 className="mb-0">{currentData.totalProducts}</h3>
              <small className="text-success">+12 new this month</small>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="stat-card warning">
              <h6 className="text-muted mb-2">Low Stock Items</h6>
              <h3 className="mb-0">{currentData.lowStock}</h3>
              <small className="text-danger">Needs attention</small>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="stat-card success">
              <h6 className="text-muted mb-2">Categories</h6>
              <h3 className="mb-0">{currentData.categories.length}</h3>
              <small className="text-info">4 active categories</small>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="admin-card">
              <div className="card-header">
                <h5 className="mb-0">Top Selling Products</h5>
              </div>
              <div className="card-body">
                <div className="admin-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Sales</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.topSelling.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>{product.sales}</td>
                          <td>${product.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="admin-card">
              <div className="card-header">
                <h5 className="mb-0">Categories Performance</h5>
              </div>
              <div className="card-body">
                <div className="admin-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Products</th>
                        <th>Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.categories.map((category, index) => (
                        <tr key={index}>
                          <td>{category.name}</td>
                          <td>{category.count}</td>
                          <td>{category.sales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Report */}
      {activeReport === 'users' && (
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="stat-card primary">
              <h6 className="text-muted mb-2">Total Users</h6>
              <h3 className="mb-0">{currentData.totalUsers}</h3>
              <small className="text-success">+{currentData.newUsers} this month</small>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="stat-card success">
              <h6 className="text-muted mb-2">Active Users</h6>
              <h3 className="mb-0">{currentData.activeUsers}</h3>
              <small className="text-info">69.4% of total</small>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="stat-card info">
              <h6 className="text-muted mb-2">New Users</h6>
              <h3 className="mb-0">{currentData.newUsers}</h3>
              <small className="text-success">+15% growth</small>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="stat-card warning">
              <h6 className="text-muted mb-2">Retention Rate</h6>
              <h3 className="mb-0">{currentData.retention}%</h3>
              <small className="text-success">+2.3% improvement</small>
            </div>
          </div>

          <div className="col-12">
            <div className="admin-card">
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
                        <th>Growth Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.userGrowth.map((item, index) => {
                        const newUsers = index > 0 ? item.users - currentData.userGrowth[index - 1].users : 0;
                        const growthRate = index > 0 ? ((newUsers / currentData.userGrowth[index - 1].users) * 100).toFixed(1) : 0;
                        return (
                          <tr key={index}>
                            <td>{item.month}</td>
                            <td>{item.users.toLocaleString()}</td>
                            <td>{newUsers}</td>
                            <td>
                              <span className={`badge ${growthRate > 5 ? 'bg-success' : growthRate > 0 ? 'bg-primary' : 'bg-secondary'}`}>
                                +{growthRate}%
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
