import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import Features from '../components/Features';
import Card from '../components/Card';
import API from '../api/axios';
import Loading from '../components/Loading';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newArrivalRes] = await Promise.all([
          API.get('/products?isFeatured=true&limit=4'),
          API.get('/products?sort=newest&limit=8'),
        ]);

        setFeaturedProducts(featuredRes.data.products || []);
        setNewArrivals(newArrivalRes.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="modern-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Discover Amazing Products
              </h1>
              <p className="hero-subtitle">
                Shop the latest trends and essentials with quality you can trust
              </p>
              <div className="hero-actions">
                <Link to="/shop" className="btn btn-primary">
                  Start Shopping
                </Link>
                <Link to="/about" className="btn btn-outline">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-placeholder">
                <span className="hero-icon">🛍️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <Features />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="products-section">
          <div className="container">
            <div className="section-header">
              <div className="section-text">
                <h2 className="section-title">
                  ✨ Featured Products
                </h2>
                <p className="section-subtitle">
                  Handpicked items just for you
                </p>
              </div>
              <Link to="/shop?featured=true" className="view-all-btn">
                View All Products →
              </Link>
            </div>
            {loading ? (
              <Loading message="Loading featured products..." />
            ) : (
              <div className="products-grid">
                {featuredProducts.map((product) => (
                  <div key={product._id} className="product-card-wrapper">
                    <Card product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="products-section bg-light">
        <div className="container">
          <div className="section-header">
            <div className="section-text">
              <h2 className="section-title">
                🆕 New Arrivals
              </h2>
              <p className="section-subtitle">
                Fresh styles and latest collections
              </p>
            </div>
            <Link to="/shop?sort=newest" className="view-all-btn">
              Shop New Arrivals →
            </Link>
          </div>
          {loading ? (
            <Loading message="Loading new arrivals..." />
          ) : newArrivals.length > 0 ? (
            <div className="products-grid">
              {newArrivals.map((product) => (
                <div key={product._id} className="product-card-wrapper">
                  <Card product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-text">No products available</p>
              <Link to="/shop" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .modern-home {
          background: #ffffff;
        }

        .hero-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-text {
          animation: fadeInLeft 1s ease;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: #64748b;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
        }

        .hero-image {
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeInRight 1s ease;
        }

        .hero-placeholder {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(102,126,234, 0.3);
        }

        .hero-icon {
          font-size: 8rem;
          opacity: 0.8;
        }

        .products-section {
          padding: 5rem 0;
        }

        .products-section.bg-light {
          background: #f8fafc;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }

        .section-text {
          flex: 1;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102,126,234,0.4);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .product-card-wrapper {
          animation: fadeInUp 0.6s ease;
          animation-fill-mode: both;
        }

        .product-card-wrapper:nth-child(1) { animation-delay: 0.1s; }
        .product-card-wrapper:nth-child(2) { animation-delay: 0.2s; }
        .product-card-wrapper:nth-child(3) { animation-delay: 0.3s; }
        .product-card-wrapper:nth-child(4) { animation-delay: 0.4s; }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-text {
          font-size: 1.2rem;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .btn {
          padding: 0.8rem 2rem;
          border-radius: 25px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #667eea;
          color: #667eea;
        }

        .btn-outline:hover {
          background: #667eea;
          color: #fff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102,126,234,0.4);
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 2rem 0;
          }

          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .hero-title {
            font-size: 2.2rem;
            line-height: 1.1;
          }

          .hero-subtitle {
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }

          .hero-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }

          .hero-placeholder {
            width: 300px;
            height: 300px;
          }

          .hero-icon {
            font-size: 6rem;
          }

          .section-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1rem;
          }

          .section-title {
            font-size: 1.8rem;
          }

          .products-section {
            padding: 3rem 0;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .btn {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 1.5rem 0;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .hero-placeholder {
            width: 250px;
            height: 250px;
          }

          .hero-icon {
            font-size: 5rem;
          }

          .section-title {
            font-size: 1.6rem;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }

          .products-section {
            padding: 2rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;