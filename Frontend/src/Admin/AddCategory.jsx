import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTags } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const AddCategory = () => {
  const [form, setForm] = useState({ name: '', description: '' });
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await API.put(`/categories/${editingId}`, form);
        alert('Category updated successfully');
      } else {
        await API.post('/categories', form);
        alert('Category added successfully');
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setForm({
      name: category.name,
      description: category.description || '',
    });
    setEditingId(category._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await API.delete(`/categories/${id}`);
      alert('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) return <Loading message="Loading categories..." />;

  return (
    <div className="container my-4">
      <div className="row">
        {/* Add/Edit Form */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                {editingId ? <><FaEdit className="me-2" />Edit Category</> : <><FaPlus className="me-2" />Add Category</>}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Enter category description (optional)"
                  />
                </div>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    title={editingId ? 'Update Category' : 'Add Category'}
                    disabled={submitting}
                  />
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

        {/* Categories List */}
        <div className="col-lg-8">
          <h4 className="mb-3">
            <FaTags className="me-2" />
            All Categories ({categories.length})
          </h4>

          {categories.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <FaTags size={50} className="text-muted mb-3" />
              <p className="text-muted">No categories created yet</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={cat._id}>
                      <td>{index + 1}</td>
                      <td className="fw-bold">{cat.name}</td>
                      <td className="text-muted">{cat.description || '-'}</td>
                      <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(cat)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(cat._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
