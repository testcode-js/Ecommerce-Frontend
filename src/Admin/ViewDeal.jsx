import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaTag, FaPercent, FaDollarSign, FaCalendarAlt, FaClock, FaShoppingCart, FaUsers, FaEye } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const ViewDeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    fetchDeal();
  }, [id]);

  const fetchDeal = async () => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock deal data
      const mockDeal = {
        _id: id,
        title: 'Flash Sale - Electronics',
        description: 'Up to 50% off on selected electronics items including laptops, smartphones, and accessories. Limited time offer with amazing discounts on top brands.',
        discountType: 'percentage',
        discountValue: 50,
        originalPrice: 999.99,
        dealPrice: 499.99,
        category: 'electronics',
        status: 'active',
        featuredImage: 'https://placehold.co/800x400',
        startDate: '2024-01-15T00:00:00',
        endDate: '2024-01-31T23:59:59',
        maxUsage: 100,
        currentUsage: 45,
        minOrderAmount: 50,
        terms: 'Valid only on selected items. Cannot be combined with other offers. Limited stock available. First come, first served basis.',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
        productIds: ['1', '2', '3'],
        totalRevenue: 22499.55,
        totalOrders: 45
      };
      
      setDeal(mockDeal);
    } catch (error) {
      console.error('Error fetching deal:', error);
      navigate('/admin/deals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Deal deleted:', id);
        navigate('/admin/deals');
      } catch (error) {
        console.error('Error deleting deal:', error);
      }
    }
  };

  const isDealExpired = () => {
    return deal && new Date(deal.endDate) < new Date();
  };

  const isDealUpcoming = () => {
    return deal && new Date(deal.startDate) > new Date();
  };

  const getUsagePercentage = () => {
    if (!deal) return 0;
    return deal.maxUsage ? Math.round((deal.currentUsage / deal.maxUsage) * 100) : 0;
  };

  const getTimeRemaining = () => {
    if (!deal) return '';
    const now = new Date();
    const end = new Date(deal.endDate);
    
    if (now > end) return 'Expired';
    
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours remaining`;
    return `${hours} hours remaining`;
  };

  if (loading) {
    return <Loading />;
  }

  if (!deal) {
    return (
      <div className="admin-page">
        <div className="content-card">
          <div className="no-data">
            <h3>Deal not found</h3>
            <Link to="/admin/deals" className="btn btn-primary">
              Back to Deals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/admin/deals" className="breadcrumb-link">
            <FaArrowLeft /> Back to Deals
          </Link>
        </div>
        <div className="page-actions">
          <Link to={`/admin/edit-deal/${deal._id}`} className="btn btn-warning">
            <FaEdit /> Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="content-card">
        <div className="deal-view-header">
          {deal.featuredImage && (
            <div className="deal-image">
              <img src={deal.featuredImage} alt={deal.title} />
            </div>
          )}
          
          <div className="deal-info">
            <h1 className="deal-title">{deal.title}</h1>
            
            <div className="deal-badges">
              <span className={`status-badge ${isDealExpired() ? 'expired' : isDealUpcoming() ? 'upcoming' : deal.status}`}>
                {isDealExpired() ? 'Expired' : isDealUpcoming() ? 'Upcoming' : deal.status}
              </span>
              <span className="category-badge">{deal.category}</span>
            </div>

            <div className="deal-description">
              <p>{deal.description}</p>
            </div>
          </div>
        </div>

        <div className="deal-pricing-section">
          <div className="price-display">
            <div className="original-price">
              <span>Original Price:</span>
              <strong>${deal.originalPrice}</strong>
            </div>
            <div className="discount-info">
              {deal.discountType === 'percentage' ? (
                <div className="discount-percentage">
                  <FaPercent />
                  <span>{deal.discountValue}% OFF</span>
                </div>
              ) : (
                <div className="discount-fixed">
                  <FaDollarSign />
                  <span>${deal.discountValue} OFF</span>
                </div>
              )}
            </div>
            <div className="deal-price">
              <span>Deal Price:</span>
              <strong className="highlight">${deal.dealPrice}</strong>
            </div>
            <div className="savings">
              You save: ${deal.discountType === 'percentage' 
                ? (parseFloat(deal.originalPrice) * parseFloat(deal.discountValue) / 100).toFixed(2)
                : deal.discountValue}
            </div>
          </div>
        </div>

        <div className="deal-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{deal.currentUsage}/{deal.maxUsage || '∞'}</h3>
              <p>Usage</p>
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{ width: `${getUsagePercentage()}%` }}
                />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaShoppingCart />
            </div>
            <div className="stat-content">
              <h3>{deal.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>${deal.totalRevenue.toLocaleString()}</h3>
              <p>Revenue Generated</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{getTimeRemaining()}</h3>
              <p>Time Remaining</p>
            </div>
          </div>
        </div>

        <div className="deal-details-section">
          <div className="detail-row">
            <div className="detail-group">
              <h4>Deal Schedule</h4>
              <div className="detail-item">
                <FaCalendarAlt />
                <span>Start: {new Date(deal.startDate).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <FaClock />
                <span>End: {new Date(deal.endDate).toLocaleString()}</span>
              </div>
            </div>

            <div className="detail-group">
              <h4>Deal Requirements</h4>
              <div className="detail-item">
                <FaShoppingCart />
                <span>Min Order: ${deal.minOrderAmount || 'No minimum'}</span>
              </div>
              <div className="detail-item">
                <FaUsers />
                <span>Max Usage: {deal.maxUsage || 'Unlimited'}</span>
              </div>
            </div>
          </div>

          {deal.productIds && deal.productIds.length > 0 && (
            <div className="detail-group">
              <h4>Applicable Products</h4>
              <div className="product-ids">
                {deal.productIds.map((productId, index) => (
                  <span key={index} className="product-id-tag">
                    Product #{productId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {deal.terms && (
            <div className="detail-group">
              <h4>Terms & Conditions</h4>
              <div className="terms-content">
                <p>{deal.terms}</p>
              </div>
            </div>
          )}

          <div className="detail-group">
            <h4>Deal Information</h4>
            <div className="detail-item">
              <span>Created: {new Date(deal.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span>Last Updated: {new Date(deal.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDeal;
