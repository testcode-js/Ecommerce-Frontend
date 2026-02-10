import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter, FaSort, FaRupeeSign } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockProducts = [
        {
          _id: '1',
          name: 'Laptop Pro 15"',
          description: 'High-performance laptop with 16GB RAM and 512GB SSD',
          price: 89999,
          category: 'Electronics',
          countInStock: 45,
          isActive: true,
          image: '/images/laptop.jpg'
        },
        {
          _id: '2',
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse with long battery life',
          price: 1299,
          category: 'Electronics',
          countInStock: 234,
          isActive: true,
          image: '/images/mouse.jpg'
        },
        {
          _id: '3',
          name: 'Gaming Keyboard',
          description: 'Mechanical gaming keyboard with RGB lighting',
          price: 4999,
          category: 'Electronics',
          countInStock: 12,
          isActive: true,
          image: '/images/keyboard.jpg'
        },
        {
          _id: '4',
          name: 'Monitor 4K',
          description: '27-inch 4K monitor with HDR support',
          price: 24999,
          category: 'Electronics',
          countInStock: 8,
          isActive: true,
          image: '/images/monitor.jpg'
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'stock') return (a.countInStock || 0) - (b.countInStock || 0);
    return 0;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title">Manage Products</h2>
        <div className="d-flex gap-3">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home</option>
          </select>
          <select 
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ maxWidth: '120px' }}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
          </select>
          <Link to="/admin/add-product" className="btn btn-primary-admin">
            <FaPlus className="me-2" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h5 className="mb-0">All Products ({sortedProducts.length})</h5>
        </div>
        <div className="card-body">
          <div className="admin-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="product-image me-3" style={{ width: '50px', height: '50px' }}>
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="img-fluid rounded"
                              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                          ) : (
                            <div className="bg-light rounded d-flex align-items-center justify-center" style={{ width: '50px', height: '50px' }}>
                              <FaBox className="text-muted" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="fw-semibold">{product.name}</div>
                          <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info">{product.category}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaRupeeSign className="text-muted me-1" />
                        <span className="fw-semibold">{product.price.toFixed(2)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${(product.countInStock || 0) > 10 ? 'bg-success' : (product.countInStock || 0) > 5 ? 'bg-warning' : 'bg-danger'}`}>
                        {product.countInStock || 0} units
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${product.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
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

export default ManageProducts;
