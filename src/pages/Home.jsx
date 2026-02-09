import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import Features from '../components/Features';
import BannerCarousel from '../components/BannerCarousel';
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
    <>
      <BannerCarousel />
      <Banner />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ✨ Featured Products
            </h2>
            <Link to="/shop?featured=true" className="btn btn-outline-primary" style={{ borderRadius: '25px', padding: '8px 20px' }}>
              View All
            </Link>
          </div>
          {loading ? (
            <Loading message="Loading featured products..." />
          ) : (
            <div className="row g-4">
              {featuredProducts.map((product) => (
                <div key={product._id} className="col-6 col-md-6 col-lg-3">
                  <Card product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* New Arrivals */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🆕 New Arrivals
          </h2>
          <Link to="/shop?sort=newest" className="btn btn-outline-success" style={{ borderRadius: '25px', padding: '8px 20px' }}>
            View All
          </Link>
        </div>
        {loading ? (
          <Loading message="Loading new arrivals..." />
        ) : newArrivals.length > 0 ? (
          <div className="row g-4">
            {newArrivals.map((product) => (
              <div key={product._id} className="col-6 col-md-6 col-lg-3">
                <Card product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center">No products available</p>
        )}
      </section>

      <Features />
    </>
  );
};

export default Home;