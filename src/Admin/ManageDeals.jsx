import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter, FaCalendarAlt, FaTag, FaPercent, FaDollarSign, FaClock } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const ManageDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockDeals = [
        {
          _id: '1',
          title: 'Flash Sale - Electronics',
          description: 'Up to 50% off on selected electronics items',
          discountType: 'percentage',
          discountValue: 50,
          originalPrice: 999.99,
          dealPrice: 499.99,
          category: 'electronics',
          status: 'active',
          featuredImage: 'https://via.placeholder.com/300x200',
          startDate: '2024-01-15T00:00:00',
          endDate: '2024-01-31T23:59:59',
          maxUsage: 100,
          currentUsage: 45,
          minOrderAmount: 50,
          createdAt: '2024-01-10',
          productIds: ['1', '2', '3']
        },
        {
          _id: '2',
          title: 'Weekend Fashion Deal',
          description: 'Get $20 off on all clothing items above $100',
          discountType: 'fixed',
          discountValue: 20,
          originalPrice: 150,
          dealPrice: 130,
          category: 'clothing',
          status: 'active',
          featuredImage: 'https://via.placeholder.com/300x200',
          startDate: '2024-01-12T00:00:00',
          endDate: '2024-01-14T23:59:59',
          maxUsage: 200,
          currentUsage: 128,
          minOrderAmount: 100,
          createdAt: '2024-01-08',
          productIds: []
        },
        {
          _id: '3',
          title: 'Home Garden Special',
          description: '30% off on home and garden products',
          discountType: 'percentage',
          discountValue: 30,
          originalPrice: 299.99,
          dealPrice: 209.99,
          category: 'home',
          status: 'scheduled',
          featuredImage: 'https://via.placeholder.com/300x200',
          startDate: '2024-02-01T00:00:00',
          endDate: '2024-02-15T23:59:59',
          maxUsage: 150,
          currentUsage: 0,
          minOrderAmount: 0,
          createdAt: '2024-01-09',
          productIds: ['4', '5']
        }
      ];
      
      setDeals(mockDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 500));
        setDeals(deals.filter(deal => deal._id !== dealId));
        console.log('Deal deleted:', dealId);
      } catch (error) {
        console.error('Error deleting deal:', error);
      }
    }
  };

  const handleStatusToggle = async (dealId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      setDeals(deals.map(deal => 
        deal._id === dealId ? { ...deal, status: newStatus } : deal
      ));
      console.log('Deal status updated:', dealId, newStatus);
    } catch (error) {
      console.error('Error updating deal status:', error);
    }
  };

  const isDealExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isDealUpcoming = (startDate) => {
    return new Date(startDate) > new Date();
  };

  const getUsagePercentage = (current, max) => {
    return max ? Math.round((current / max) * 100) : 0;
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || deal.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || deal.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'endDate':
        return new Date(a.endDate) - new Date(b.endDate);
      case 'discount':
        return b.discountValue - a.discountValue;
      case 'createdAt':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Manage Deals</h2>
        <Link to="/admin/add-deal" className="btn btn-primary">
          <FaPlus /> Add New Deal
        </Link>
      </div>

      <div className="content-card">
        <div className="filters-section">
          <div className="filter-group">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
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

          <div className="filter-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Latest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="endDate">Ending Soon</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Deal</th>
                <th>Category</th>
                <th>Discount</th>
                <th>Prices</th>
                <th>Status</th>
                <th>Usage</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDeals.map((deal) => {
                const isExpired = isDealExpired(deal.endDate);
                const isUpcoming = isDealUpcoming(deal.startDate);
                const usagePercentage = getUsagePercentage(deal.currentUsage, deal.maxUsage);
                
                return (
                  <tr key={deal._id}>
                    <td>
                      <div className="deal-info">
                        {deal.featuredImage && (
                          <img 
                            src={deal.featuredImage} 
                            alt={deal.title}
                            className="deal-thumbnail"
                          />
                        )}
                        <div className="deal-details">
                          <h4>{deal.title}</h4>
                          <p>{deal.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{deal.category}</span>
                    </td>
                    <td>
                      <div className="discount-display">
                        {deal.discountType === 'percentage' ? (
                          <><FaPercent /> {deal.discountValue}%</>
                        ) : (
                          <><FaDollarSign /> ${deal.discountValue}</>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="price-info">
                        <div className="original-price">${deal.originalPrice}</div>
                        <div className="deal-price">${deal.dealPrice}</div>
                      </div>
                    </td>
                    <td>
                      <button
                        className={`status-badge ${isExpired ? 'expired' : isUpcoming ? 'upcoming' : deal.status}`}
                        onClick={() => !isExpired && handleStatusToggle(deal._id, deal.status)}
                        disabled={isExpired}
                      >
                        {isExpired ? 'Expired' : isUpcoming ? 'Upcoming' : deal.status}
                      </button>
                    </td>
                    <td>
                      <div className="usage-info">
                        <div className="usage-bar">
                          <div 
                            className="usage-fill" 
                            style={{ width: `${usagePercentage}%` }}
                          />
                        </div>
                        <span>{deal.currentUsage}/{deal.maxUsage || '∞'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="duration-info">
                        <div className="date-info">
                          <FaCalendarAlt />
                          <span>{new Date(deal.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="date-info">
                          <FaClock />
                          <span>{new Date(deal.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/deal/${deal._id}`} className="btn btn-sm btn-info">
                          <FaEye />
                        </Link>
                        <Link to={`/admin/edit-deal/${deal._id}`} className="btn btn-sm btn-warning">
                          <FaEdit />
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(deal._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedDeals.length === 0 && (
          <div className="no-data">
            <FaTag />
            <h3>No deals found</h3>
            <p>Try adjusting your filters or create a new deal.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDeals;
