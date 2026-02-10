import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTags, FaEdit, FaTrash, FaPlus, FaSearch, FaBox } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockCategories = [
        {
          _id: '1',
          name: 'Electronics',
          description: 'Electronic devices and accessories',
          productCount: 89,
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          _id: '2',
          name: 'Clothing',
          description: 'Fashion and apparel',
          productCount: 67,
          isActive: true,
          createdAt: '2024-01-02'
        },
        {
          _id: '3',
          name: 'Books',
          description: 'Books and educational materials',
          productCount: 45,
          isActive: true,
          createdAt: '2024-01-03'
        },
        {
          _id: '4',
          name: 'Home & Garden',
          description: 'Home improvement and garden supplies',
          productCount: 44,
          isActive: true,
          createdAt: '2024-01-04'
        },
        {
          _id: '5',
          name: 'Sports',
          description: 'Sports equipment and accessories',
          productCount: 23,
          isActive: false,
          createdAt: '2024-01-05'
        }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Manage Categories</h2>
        <div className="d-flex gap-3">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/admin/add-category" className="btn btn-primary-admin">
            <FaPlus className="me-2" />
            Add Category
          </Link>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card primary">
            <h6 className="text-muted mb-2">Total Categories</h6>
            <h3 className="mb-0">{categories.length}</h3>
            <small className="text-success">+2 this month</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card success">
            <h6 className="text-muted mb-2">Active Categories</h6>
            <h3 className="mb-0">{categories.filter(c => c.isActive).length}</h3>
            <small className="text-info">Currently active</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card info">
            <h6 className="text-muted mb-2">Total Products</h6>
            <h3 className="mb-0">{categories.reduce((acc, cat) => acc + cat.productCount, 0)}</h3>
            <small className="text-warning">Across all categories</small>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card warning">
            <h6 className="text-muted mb-2">Avg Products/Category</h6>
            <h3 className="mb-0">{Math.round(categories.reduce((acc, cat) => acc + cat.productCount, 0) / categories.length)}</h3>
            <small className="text-info">Average distribution</small>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">All Categories ({filteredCategories.length})</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="category-icon me-3" style={{ 
                          width: '40px', 
                          height: '40px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <FaTags />
                        </div>
                        <div>
                          <div className="fw-semibold">{category.name}</div>
                          <small className="text-muted">Category ID: #{category._id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{category.description}</div>
                        <small className="text-muted">Max length: 100 chars</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaBox className="me-2 text-muted" />
                        <span className="badge bg-primary">{category.productCount} products</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${category.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <small className="text-muted">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary">
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

export default ManageCategories;
