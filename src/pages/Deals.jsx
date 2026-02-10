import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaFire, FaClock, FaShoppingCart, FaTag, FaPercentage } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        
        // Fetch deals from API
        const { data: dealsData } = await API.get('/deals', {
          params: {
            status: 'active',
            limit: 100
          }
        });
        
        setDeals(dealsData.deals || []);
      } catch (error) {
        console.error('Error fetching deals:', error);
        // Fallback to empty array on error
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const filteredDeals = deals.filter(deal => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'flash') return deal.flashDeal;
    if (activeFilter === 'clearance') return deal.clearance;
    if (activeFilter === 'seasonal') return deal.seasonalDeal;
    return true;
  });

  const getDiscountPercentage = (product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    
    return `${hours}h ${minutes}m remaining`;
  };

  if (loading) return <Loading message="Loading amazing deals..." />;

  return (
    <div className="deals-page">
      {/* Hero Header */}
      <div className="deals-header">
        <div className="deals-hero">
          <h1>
            <FaFire /> Hot Deals
          </h1>
          <p>Grab these amazing offers before they're gone!</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-container">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <FaTag /> All Deals
          </button>
          <button
            className={`filter-tab ${activeFilter === 'flash' ? 'active' : ''}`}
            onClick={() => setActiveFilter('flash')}
          >
            <FaFire /> Flash Deals
          </button>
          <button
            className={`filter-tab ${activeFilter === 'clearance' ? 'active' : ''}`}
            onClick={() => setActiveFilter('clearance')}
          >
            <FaPercentage /> Clearance
          </button>
          <button
            className={`filter-tab ${activeFilter === 'seasonal' ? 'active' : ''}`}
            onClick={() => setActiveFilter('seasonal')}
          >
            <FaStar /> Seasonal
          </button>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="deals-container">
        {filteredDeals.length === 0 ? (
          <div className="no-deals">
            <FaFire />
            <h3>No deals available</h3>
            <p>Check back later for amazing offers!</p>
          </div>
        ) : (
          <div className="deals-grid">
            {filteredDeals.map(deal => {
              const discount = getDiscountPercentage(deal);
              const isFlashDeal = deal.flashDeal;
              const timeRemaining = isFlashDeal && deal.endDate ? getTimeRemaining(deal.endDate) : null;

              return (
                <article key={deal._id} className={`deal-card ${isFlashDeal ? 'flash' : ''}`}>
                  {/* Deal Badge */}
                  <div className="deal-badge">
                    {isFlashDeal ? (
                      <>
                        <FaFire /> FLASH DEAL
                      </>
                    ) : discount > 0 ? (
                      <>
                        <FaPercentage /> {discount}% OFF
                      </>
                    ) : (
                      <>
                        <FaTag /> DEAL
                      </>
                    )}
                  </div>

                  {/* Flash Deal Timer */}
                  {isFlashDeal && timeRemaining && (
                    <div className="flash-timer">
                      <FaClock />
                      {timeRemaining}
                    </div>
                  )}

                  <Link to={`/product/${deal._id}`} className="deal-image-link">
                    <div className="deal-image">
                      <img
                        src={deal.featuredImage ? (deal.featuredImage.startsWith('http') ? deal.featuredImage : `${import.meta.env.VITE_UPLOADS_URL}/${deal.featuredImage}`) : 'https://placehold.co/300'}
                        alt={deal.title}
                      />
                      <div className="deal-overlay">
                        <span>View Details</span>
                      </div>
                    </div>
                  </Link>

                  <div className="deal-content">
                    <Link to={`/product/${deal._id}`} className="deal-title-link">
                      <h3>{deal.title}</h3>
                    </Link>

                    {/* Rating */}
                    <div className="deal-rating">
                      <FaStar />
                      <span>{deal.rating || 4.5}</span>
                      <span className="reviews">({deal.numReviews || 0} reviews)</span>
                    </div>

                    {/* Description */}
                    <p className="deal-description">{deal.description}</p>

                    {/* Price */}
                    <div className="deal-price">
                      <span className="current-price">₹{deal.dealPrice}</span>
                      {deal.originalPrice > deal.dealPrice && (
                        <span className="original-price">₹{deal.originalPrice}</span>
                      )}
                      {deal.originalPrice > deal.dealPrice && (
                        <span className="savings">Save ₹{deal.originalPrice - deal.dealPrice}</span>
                      )}
                    </div>

                    {/* Stock Warning */}
                    {deal.stock < 10 && deal.stock > 0 && (
                      <div className="stock-warning">
                        <FaFire /> Only {deal.stock} left in stock!
                      </div>
                    )}

                    <Button
                      variant="primary"
                      className="add-cart-btn"
                      onClick={() => {/* Add to cart logic */}}
                      disabled={deal.stock <= 0}
                    >
                      <FaShoppingCart /> Add to Cart
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="deals-newsletter">
        <div className="newsletter-content">
          <h3>Never Miss a Deal!</h3>
          <p>Subscribe to our newsletter for exclusive offers and flash deals.</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
            />
            <Button variant="danger">Subscribe</Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .deals-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .deals-header {
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .deals-hero h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .deals-hero p {
          font-size: 1.25rem;
          opacity: 0.9;
        }

        .filter-container {
          background: white;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .filter-tabs {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 900px;
          margin: 0 auto;
        }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          background: white;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-tab:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        .deals-container {
          padding: 3rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .no-deals {
          text-align: center;
          padding: 4rem;
          color: #64748b;
        }

        .no-deals svg {
          font-size: 4rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .deals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .deal-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
        }

        .deal-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .deal-card.flash {
          border: 2px solid #ef4444;
          animation: pulse-border 2s infinite;
        }

        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 20px 5px rgba(239, 68, 68, 0.2); }
        }

        .deal-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.875rem;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .flash-timer {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #1f2937;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .deal-image-link {
          display: block;
        }

        .deal-image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .deal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .deal-card:hover .deal-image img {
          transform: scale(1.1);
        }

        .deal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(239, 68, 68, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .deal-card:hover .deal-overlay {
          opacity: 1;
        }

        .deal-overlay span {
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid white;
          border-radius: 50px;
        }

        .deal-content {
          padding: 1.5rem;
        }

        .deal-title-link {
          text-decoration: none;
          color: inherit;
        }

        .deal-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .deal-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .deal-rating svg {
          color: #fbbf24;
        }

        .deal-rating span {
          font-weight: 600;
          color: #1e293b;
        }

        .deal-rating .reviews {
          color: #64748b;
          font-weight: 400;
        }

        .deal-description {
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .deal-price {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .current-price {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ef4444;
        }

        .original-price {
          font-size: 1.1rem;
          color: #64748b;
          text-decoration: line-through;
        }

        .savings {
          background: #dcfce7;
          color: #166534;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .stock-warning {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .add-cart-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 700;
        }

        .deals-newsletter {
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
          margin-top: 4rem;
        }

        .newsletter-content h3 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .newsletter-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .newsletter-form {
          display: flex;
          gap: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .newsletter-form input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .deals-header {
            padding: 2rem 1rem;
          }

          .deals-hero h1 {
            font-size: 2rem;
          }

          .filter-tabs {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-tab {
            justify-content: center;
          }

          .deals-container {
            padding: 1.5rem;
          }

          .deals-grid {
            grid-template-columns: 1fr;
          }

          .deal-price {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .newsletter-form {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Deals;
