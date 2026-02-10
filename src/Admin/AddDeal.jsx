import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaImage, FaCalendarAlt, FaTag, FaHeading, FaPercent, FaClock, FaDollarSign } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const AddDeal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    originalPrice: '',
    dealPrice: '',
    category: '',
    productIds: '',
    featuredImage: '',
    status: 'active',
    startDate: '',
    endDate: '',
    maxUsage: '',
    minOrderAmount: '',
    terms: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDiscountTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      discountType: type,
      discountValue: '',
      dealPrice: ''
    }));
  };

  const calculateDealPrice = () => {
    if (formData.originalPrice && formData.discountValue) {
      const original = parseFloat(formData.originalPrice);
      const discount = parseFloat(formData.discountValue);
      
      if (formData.discountType === 'percentage') {
        const dealPrice = original - (original * discount / 100);
        setFormData(prev => ({
          ...prev,
          dealPrice: dealPrice.toFixed(2)
        }));
      } else {
        const dealPrice = original - discount;
        setFormData(prev => ({
          ...prev,
          dealPrice: Math.max(0, dealPrice).toFixed(2)
        }));
      }
    }
  };

  React.useEffect(() => {
    calculateDealPrice();
  }, [formData.originalPrice, formData.discountValue, formData.discountType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Deal created:', formData);
      navigate('/admin/deals');
    } catch (error) {
      console.error('Error creating deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/deals');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Add New Deal</h2>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>
            <FaTimes /> Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <FaSave /> Save Deal
          </button>
        </div>
      </div>

      <div className="content-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaHeading /> Deal Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter deal title"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <FaTag /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports & Outdoors</option>
                <option value="books">Books & Media</option>
                <option value="toys">Toys & Games</option>
                <option value="food">Food & Beverages</option>
                <option value="health">Health & Beauty</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the deal in detail..."
              rows="4"
              required
            />
          </div>

          <div className="discount-section">
            <h4>Discount Details</h4>
            <div className="discount-type-selector">
              <label className="radio-label">
                <input
                  type="radio"
                  name="discountType"
                  value="percentage"
                  checked={formData.discountType === 'percentage'}
                  onChange={() => handleDiscountTypeChange('percentage')}
                />
                <FaPercent /> Percentage Discount
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="discountType"
                  value="fixed"
                  checked={formData.discountType === 'fixed'}
                  onChange={() => handleDiscountTypeChange('fixed')}
                />
                <FaDollarSign /> Fixed Amount Discount
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  {formData.discountType === 'percentage' ? (
                    <><FaPercent /> Discount Percentage</>
                  ) : (
                    <><FaDollarSign /> Discount Amount</>
                  )}
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder={formData.discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                  min="0"
                  max={formData.discountType === 'percentage' ? '100' : ''}
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <FaDollarSign /> Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="Enter original price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {formData.dealPrice && (
              <div className="deal-price-display">
                <strong>Deal Price: ${formData.dealPrice}</strong>
                <span className="savings">
                  You save: ${formData.discountType === 'percentage' 
                    ? (parseFloat(formData.originalPrice) * parseFloat(formData.discountValue) / 100).toFixed(2)
                    : formData.discountValue}
                </span>
              </div>
            )}
          </div>

          <div className="date-section">
            <h4>Deal Schedule</h4>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaCalendarAlt /> Start Date
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <FaClock /> End Date
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Maximum Usage Limit</label>
              <input
                type="number"
                name="maxUsage"
                value={formData.maxUsage}
                onChange={handleChange}
                placeholder="Leave empty for unlimited"
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Minimum Order Amount</label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                placeholder="Optional minimum order amount"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product IDs (comma-separated)</label>
            <input
              type="text"
              name="productIds"
              value={formData.productIds}
              onChange={handleChange}
              placeholder="Enter product IDs or leave empty for all products"
            />
          </div>

          <div className="form-group">
            <label>
              <FaImage /> Featured Image URL
            </label>
            <input
              type="url"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              placeholder="https://example.com/deal-image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Terms & Conditions</label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              placeholder="Enter terms and conditions for this deal..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FaSave /> Save Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeal;
