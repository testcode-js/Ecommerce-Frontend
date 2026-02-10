import React, { useState } from 'react';
import { FaBox, FaRupeeSign, FaDownload, FaEye, FaChartLine, FaTags, FaStar } from 'react-icons/fa';
import { downloadReport, formatCurrency, formatDate } from '../utils/downloadUtils';
import './AdminLayout.css';

const ProductReport = () => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('sales');

  // Enhanced product data with more details
  const [productData] = useState([
    {
      id: 'PRD001',
      name: 'Laptop Pro 15"',
      category: 'Electronics',
      sku: 'LP-PRO-15-001',
      price: 89999,
      sales: 156,
      revenue: 14040000,
      stock: 45,
      views: 2890,
      rating: 4.5,
      reviews: 89,
      returns: 3,
      profit: 28080000,
      margin: 20,
      status: 'active',
      addedDate: '2024-01-01',
      lastSold: '2024-01-15'
    },
    {
      id: 'PRD002',
      name: 'Wireless Mouse',
      category: 'Electronics',
      sku: 'WM-001',
      price: 1299,
      sales: 342,
      revenue: 444600,
      stock: 234,
      views: 4567,
      rating: 4.2,
      reviews: 156,
      returns: 8,
      profit: 222300,
      margin: 50,
      status: 'active',
      addedDate: '2024-01-02',
      lastSold: '2024-01-15'
    },
    {
      id: 'PRD003',
      name: 'Gaming Keyboard',
      category: 'Electronics',
      sku: 'GK-001',
      price: 4999,
      sales: 89,
      revenue: 444900,
      stock: 12,
      views: 1234,
      rating: 4.7,
      reviews: 45,
      returns: 2,
      profit: 224450,
      margin: 50.4,
      status: 'active',
      addedDate: '2024-01-03',
      lastSold: '2024-01-14'
    },
    {
      id: 'PRD004',
      name: 'Monitor 4K',
      category: 'Electronics',
      sku: 'MN-4K-001',
      price: 24999,
      sales: 67,
      revenue: 1674933,
      stock: 8,
      views: 987,
      rating: 4.8,
      reviews: 34,
      returns: 1,
      profit: 837466,
      margin: 50,
      status: 'low_stock',
      addedDate: '2024-01-04',
      lastSold: '2024-01-15'
    },
    {
      id: 'PRD005',
      name: 'Headphones Pro',
      category: 'Electronics',
      sku: 'HP-001',
      price: 7999,
      sales: 234,
      revenue: 1871766,
      stock: 156,
      views: 3456,
      rating: 4.3,
      reviews: 78,
      returns: 5,
      profit: 935883,
      margin: 50,
      status: 'active',
      addedDate: '2024-01-05',
      lastSold: '2024-01-15'
    },
    {
      id: 'PRD006',
      name: 'Webcam HD',
      category: 'Electronics',
      sku: 'WC-HD-001',
      price: 2499,
      sales: 123,
      revenue: 307477,
      stock: 89,
      views: 2345,
      rating: 4.1,
      reviews: 23,
      returns: 4,
      profit: 153738,
      margin: 50,
      status: 'active',
      addedDate: '2024-01-06',
      lastSold: '2024-01-13'
    }
  ]);

  // Filter and sort products
  const filteredProducts = productData.filter(product => 
    filterCategory === 'all' || product.category === filterCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'sales': return b.sales - a.sales;
      case 'revenue': return b.revenue - a.revenue;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  // Calculate totals
  const totalProducts = productData.length;
  const totalSales = productData.reduce((acc, p) => acc + p.sales, 0);
  const totalRevenue = productData.reduce((acc, p) => acc + p.revenue, 0);
  const totalViews = productData.reduce((acc, p) => acc + p.views, 0);
  const avgRating = (productData.reduce((acc, p) => acc + p.rating, 0) / productData.length).toFixed(1);
  const totalReturns = productData.reduce((acc, p) => acc + p.returns, 0);
  const totalProfit = productData.reduce((acc, p) => acc + p.profit, 0);
  const lowStockProducts = productData.filter(p => p.stock < 20).length;

  const handleDownload = (format) => {
    const headers = ['id', 'name', 'category', 'sku', 'price', 'sales', 'revenue', 'stock', 'views', 'rating', 'reviews', 'returns', 'profit', 'margin', 'status', 'addedDate', 'lastSold'];
    const downloadData = sortedProducts.map(product => ({
      ...product,
      price: formatCurrency(product.price),
      revenue: formatCurrency(product.revenue),
      profit: formatCurrency(product.profit),
      addedDate: formatDate(product.addedDate),
      lastSold: formatDate(product.lastSold)
    }));

    downloadReport(
      downloadData,
      `product-report-${filterCategory}-${formatDate(new Date())}`,
      format,
      'Product Report',
      headers
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Product Report</h2>
        <div className="d-flex gap-3">
          <select 
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
          </select>
          <select 
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ maxWidth: '120px' }}
          >
            <option value="sales">Sort by Sales</option>
            <option value="revenue">Sort by Revenue</option>
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
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
            <h6 className="text-muted mb-2">Total Products</h6>
            <h3 className="mb-0">{totalProducts}</h3>
            <small className="text-success">+12 new this month</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card success">
            <h6 className="text-muted mb-2">Total Sales</h6>
            <h3 className="mb-0">{totalSales.toLocaleString()}</h3>
            <small className="text-success">+18.5% vs last month</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card info">
            <h6 className="text-muted mb-2">Total Revenue</h6>
            <h3 className="mb-0">{formatCurrency(totalRevenue)}</h3>
            <small className="text-success">+22.3% vs last month</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card warning">
            <h6 className="text-muted mb-2">Avg Rating</h6>
            <h3 className="mb-0">{avgRating}</h3>
            <small className="text-warning">+0.2 points</small>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Total Views</h6>
            <h3 className="mb-0">{totalViews.toLocaleString()}</h3>
            <small className="text-info">Product views</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Total Returns</h6>
            <h3 className="mb-0">{totalReturns}</h3>
            <small className="text-danger">Returns processed</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Total Profit</h6>
            <h3 className="mb-0">{formatCurrency(totalProfit)}</h3>
            <small className="text-success">Net profit</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card">
            <h6 className="text-muted mb-2">Low Stock</h6>
            <h3 className="mb-0">{lowStockProducts}</h3>
            <small className="text-warning">Need restocking</small>
          </div>
        </div>
      </div>

      {/* Enhanced Product Table */}
      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">Product Performance ({sortedProducts.length})</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Profit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div>
                        <div className="fw-semibold">{product.name}</div>
                        <small className="text-muted">{product.category}</small>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">{product.sku}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaRupeeSign className="text-muted me-1" />
                        <span>{product.price.toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaChartLine className="me-2 text-muted" />
                        {product.sales}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaRupeeSign className="text-muted me-1" />
                        <span className="fw-semibold">{(product.revenue / 1000).toFixed(1)}K</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${product.stock > 50 ? 'bg-success' : product.stock > 20 ? 'bg-warning' : 'bg-danger'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-1">{product.rating}</span>
                        <div className="text-warning">
                          {'★'.repeat(Math.floor(product.rating))}
                        </div>
                        <small className="text-muted ms-1">({product.reviews})</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaRupeeSign className="text-muted me-1" />
                        <span>{(product.profit / 1000).toFixed(1)}K</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${product.status === 'active' ? 'bg-success' : product.status === 'low_stock' ? 'bg-warning' : 'bg-secondary'}`}>
                        {product.status.replace('_', ' ').toUpperCase()}
                      </span>
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

export default ProductReport;
