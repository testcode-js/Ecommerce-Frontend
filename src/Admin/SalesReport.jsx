import React, { useState } from 'react';
import { FaChartLine, FaRupeeSign, FaShoppingCart, FaDownload, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { downloadReport, formatCurrency, formatDate } from '../utils/downloadUtils';
import './AdminLayout.css';

const SalesReport = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [groupBy, setGroupBy] = useState('day');

  // Enhanced sales data with more details
  const [salesData] = useState([
    { 
      date: '2024-01-10', 
      revenue: 85000, 
      orders: 65, 
      customers: 45, 
      avgOrderValue: 1307.69,
      productsSold: 89,
      refunds: 2,
      discountUsed: 5
    },
    { 
      date: '2024-01-11', 
      revenue: 92000, 
      orders: 72, 
      customers: 52, 
      avgOrderValue: 1277.78,
      productsSold: 98,
      refunds: 1,
      discountUsed: 8
    },
    { 
      date: '2024-01-12', 
      revenue: 118000, 
      orders: 89, 
      customers: 67, 
      avgOrderValue: 1325.84,
      productsSold: 124,
      refunds: 0,
      discountUsed: 12
    },
    { 
      date: '2024-01-13', 
      revenue: 105000, 
      orders: 78, 
      customers: 58, 
      avgOrderValue: 1346.15,
      productsSold: 102,
      refunds: 3,
      discountUsed: 6
    },
    { 
      date: '2024-01-14', 
      revenue: 132000, 
      orders: 95, 
      customers: 73, 
      avgOrderValue: 1389.47,
      productsSold: 134,
      refunds: 1,
      discountUsed: 15
    },
    { 
      date: '2024-01-15', 
      revenue: 148000, 
      orders: 108, 
      customers: 82, 
      avgOrderValue: 1370.37,
      productsSold: 156,
      refunds: 2,
      discountUsed: 18
    }
  ]);

  const totalRevenue = salesData.reduce((acc, item) => acc + item.revenue, 0);
  const totalOrders = salesData.reduce((acc, item) => acc + item.orders, 0);
  const totalCustomers = salesData.reduce((acc, item) => acc + item.customers, 0);
  const totalProductsSold = salesData.reduce((acc, item) => acc + item.productsSold, 0);
  const totalRefunds = salesData.reduce((acc, item) => acc + item.refunds, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const handleDownload = (format) => {
    const headers = ['date', 'revenue', 'orders', 'customers', 'avgOrderValue', 'productsSold', 'refunds', 'discountUsed'];
    const downloadData = salesData.map(item => ({
      ...item,
      revenue: formatCurrency(item.revenue),
      avgOrderValue: formatCurrency(item.avgOrderValue),
      date: formatDate(item.date)
    }));

    downloadReport(
      downloadData,
      `sales-report-${dateRange}-${formatDate(new Date())}`,
      format,
      'Sales Report',
      headers
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Sales Report</h2>
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
            <h6 className="text-muted mb-2">Total Revenue</h6>
            <h3 className="mb-0">{formatCurrency(totalRevenue)}</h3>
            <small className="text-success">+12.5% vs last period</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card success">
            <h6 className="text-muted mb-2">Total Orders</h6>
            <h3 className="mb-0">{totalOrders.toLocaleString()}</h3>
            <small className="text-success">+8.2% vs last period</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card info">
            <h6 className="text-muted mb-2">Total Customers</h6>
            <h3 className="mb-0">{totalCustomers.toLocaleString()}</h3>
            <small className="text-info">Unique customers</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card warning">
            <h6 className="text-muted mb-2">Avg Order Value</h6>
            <h3 className="mb-0">{formatCurrency(avgOrderValue)}</h3>
            <small className="text-warning">+2.1% increase</small>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Products Sold</h6>
            <h3 className="mb-0">{totalProductsSold.toLocaleString()}</h3>
            <small className="text-info">Total items</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Refunds</h6>
            <h3 className="mb-0">{totalRefunds}</h3>
            <small className="text-danger">Returns processed</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Discounts Used</h6>
            <h3 className="mb-0">{salesData.reduce((acc, item) => acc + item.discountUsed, 0)}</h3>
            <small className="text-success">Promotions applied</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Conversion Rate</h6>
            <h3 className="mb-0">3.2%</h3>
            <small className="text-success">+0.5% improvement</small>
          </div>
        </div>
      </div>

      {/* Enhanced Sales Table */}
      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">Sales Breakdown</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                  <th>Customers</th>
                  <th>Avg Order Value</th>
                  <th>Products Sold</th>
                  <th>Refunds</th>
                  <th>Discounts</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="me-2 text-muted" />
                        {formatDate(item.date)}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaRupeeSign className="text-muted me-1" />
                        <span className="fw-semibold">{item.revenue.toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaShoppingCart className="me-2 text-muted" />
                        {item.orders}
                      </div>
                    </td>
                    <td>{item.customers}</td>
                    <td>{formatCurrency(item.avgOrderValue)}</td>
                    <td>{item.productsSold}</td>
                    <td>
                      <span className={`badge ${item.refunds > 0 ? 'bg-danger' : 'bg-success'}`}>
                        {item.refunds}
                      </span>
                    </td>
                    <td>{item.discountUsed}</td>
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

export default SalesReport;
