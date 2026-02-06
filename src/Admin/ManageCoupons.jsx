import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTags } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minimumPurchase: 0,
    maxUses: '',
    expiresAt: '',
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/coupons');
      setCoupons(data);
    } catch (err) {
      console.error('Fetch coupons error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setForm({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minimumPurchase: 0,
      maxUses: '',
      expiresAt: '',
      isActive: true,
    });
    setEditingCoupon(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const couponData = {
        ...form,
        code: form.code.toUpperCase(),
        discountValue: Number(form.discountValue),
        minimumPurchase: Number(form.minimumPurchase),
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      };

      if (editingCoupon) {
        await API.put(`/coupons/${editingCoupon._id}`, couponData);
      } else {
        await API.post('/coupons', couponData);
      }

      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumPurchase: coupon.minimumPurchase || 0,
      maxUses: coupon.maxUses || '',
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await API.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const toggleActive = async (coupon) => {
    try {
      await API.put(`/coupons/${coupon._id}`, { isActive: !coupon.isActive });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update coupon');
    }
  };

  if (loading) return <Loading message="Loading coupons..." />;

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaTags className="me-2" />
          Manage Coupons
        </h2>
        <Button
          title={<><FaPlus className="me-2" />Add Coupon</>}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        />
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-5">
          <FaTags size={60} className="text-muted mb-3" />
          <p className="text-muted">No coupons created yet</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min. Purchase</th>
                <th>Uses</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>
                    <strong className="text-primary">{coupon.code}</strong>
                  </td>
                  <td>
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </td>
                  <td>₹{coupon.minimumPurchase || 0}</td>
                  <td>
                    {coupon.usedCount || 0}
                    {coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                  </td>
                  <td>
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={coupon.isActive}
                        onChange={() => toggleActive(coupon)}
                      />
                      <label className={`form-check-label ${coupon.isActive ? 'text-success' : 'text-danger'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(coupon)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(coupon._id)}
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

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Coupon Code *</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="e.g., SAVE20"
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Discount Type *</label>
                      <select
                        className="form-select"
                        value={form.discountType}
                        onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Discount Value *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.discountValue}
                        onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                        min="0"
                        max={form.discountType === 'percentage' ? 100 : undefined}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Minimum Purchase (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.minimumPurchase}
                        onChange={(e) => setForm({ ...form, minimumPurchase: e.target.value })}
                        min="0"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Max Uses (leave empty for unlimited)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.maxUses}
                        onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Expiry Date (optional)</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.expiresAt}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
