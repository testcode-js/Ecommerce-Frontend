import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBox, FaStar } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const AddProduct = () => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
    isFeatured: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products?limit=100');
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file || null);
    setRemoveImage(false);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview(null);
    setRemoveImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetForm = () => {
    setForm({
      name: '',
      price: '',
      originalPrice: '',
      description: '',
      category: '',
      brand: '',
      stock: '',
      isFeatured: false,
    });
    setImage(null);
    setImagePreview(null);
    setRemoveImage(false);
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    if (form.originalPrice) formData.append('originalPrice', form.originalPrice);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('brand', form.brand);
    formData.append('stock', form.stock || 0);
    formData.append('isFeatured', form.isFeatured);
    if (image) formData.append('image', image);
    if (editingId && removeImage && !image) formData.append('removeImage', 'true');

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product updated successfully');
      } else {
        await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Product added successfully');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      description: product.description || '',
      category: typeof product.category === 'object' ? product.category._id : product.category || '',
      brand: product.brand || '',
      stock: product.stock || 0,
      isFeatured: product.isFeatured || false,
    });
    setEditingId(product._id);
    setImage(null);
    setImagePreview(product.image ? `${UPLOADS_URL}/${product.image}` : null);
    setRemoveImage(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await API.delete(`/products/${id}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const getCategoryName = (category) => {
    if (typeof category === 'object') return category?.name || 'N/A';
    const cat = categories.find((c) => c._id === category);
    return cat ? cat.name : 'N/A';
  };

  if (loading) return <Loading message="Loading products..." />;

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Add/Edit Form */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                {editingId ? <><FaEdit className="me-2" />Edit Product</> : <><FaPlus className="me-2" />Add Product</>}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Image {editingId && '(optional)'}</label>
                  <input
                    type="file"
                    className="form-control"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    {...(!editingId && { required: true })}
                  />
                  {imagePreview && (
                    <div className="mt-2 d-flex align-items-start gap-2">
                      <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ height: '100px' }} />
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleRemoveImage}>
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Original Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Brand *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isFeatured"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="isFeatured">
                    <FaStar className="text-warning me-1" />
                    Featured Product
                  </label>
                </div>

                <div className="d-flex gap-2">
                  <Button type="submit" title={editingId ? 'Update Product' : 'Add Product'} disabled={submitting} />
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="col-lg-8">
          <h4 className="mb-3">
            <FaBox className="me-2" />
            All Products ({products.length})
          </h4>

          <div className="row">
            {products.map((p) => (
              <div key={p._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="position-relative">
                    {p.isFeatured && (
                      <span className="badge bg-warning position-absolute" style={{ top: 10, right: 10 }}>
                        <FaStar /> Featured
                      </span>
                    )}
                    <img
                      src={p.image ? `${UPLOADS_URL}/${p.image}` : 'https://via.placeholder.com/200'}
                      alt={p.name}
                      className="card-img-top"
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">{p.name}</h6>
                    <p className="text-muted small mb-1">Brand: {p.brand || 'N/A'}</p>
                    <p className="text-muted small mb-1">Category: {getCategoryName(p.category)}</p>
                    <p className="text-muted small mb-2">Stock: {p.stock || 0}</p>
                    <div className="mb-2">
                      <span className="fw-bold text-primary">₹{p.price}</span>
                      {p.originalPrice > p.price && (
                        <span className="text-muted text-decoration-line-through ms-2 small">₹{p.originalPrice}</span>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary flex-grow-1" onClick={() => handleEdit(p)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
