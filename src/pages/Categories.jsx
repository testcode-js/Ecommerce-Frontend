import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTags, FaFilter, FaSearch, FaStar, FaShoppingCart } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for demo purposes since backend endpoints might not exist
        const mockCategories = [
          { _id: '1', name: 'Fashion', count: 15 },
          { _id: '2', name: 'Electronics', count: 12 },
          { _id: '3', name: 'Home & Garden', count: 8 },
          { _id: '4', name: 'Sports', count: 6 },
          { _id: '5', name: 'Books', count: 10 },
          { _id: '6', name: 'Toys', count: 7 }
        ];

        const mockProducts = [
          {
            _id: '1',
            name: 'Summer Dress',
            price: 999,
            originalPrice: 1499,
            image: 'https://via.placeholder.com/300',
            category: '1',
            rating: 4.5,
            numReviews: 234,
            stock: 15,
            brand: 'Fashion Hub'
          },
          {
            _id: '2',
            name: 'Wireless Headphones',
            price: 1999,
            originalPrice: 2999,
            image: 'https://via.placeholder.com/300',
            category: '2',
            rating: 4.2,
            numReviews: 156,
            stock: 8,
            brand: 'TechPro'
          },
          {
            _id: '3',
            name: 'Garden Tools Set',
            price: 799,
            originalPrice: 999,
            image: 'https://via.placeholder.com/300',
            category: '3',
            rating: 4.3,
            numReviews: 89,
            stock: 12,
            brand: 'GreenThumb'
          },
          {
            _id: '4',
            name: 'Yoga Mat',
            price: 499,
            originalPrice: 699,
            image: 'https://via.placeholder.com/300',
            category: '4',
            rating: 4.7,
            numReviews: 45,
            stock: 25,
            brand: 'FitLife'
          },
          {
            _id: '5',
            name: 'Bestseller Novel',
            price: 299,
            originalPrice: 399,
            image: 'https://via.placeholder.com/300',
            category: '5',
            rating: 4.8,
            numReviews: 167,
            stock: 30,
            brand: 'BookWorld'
          },
          {
            _id: '6',
            name: 'Educational Puzzle',
            price: 399,
            originalPrice: 599,
            image: 'https://via.placeholder.com/300',
            category: '6',
            rating: 4.4,
            numReviews: 78,
            stock: 18,
            brand: 'SmartKids'
          }
        ];
        
        setCategories(mockCategories);
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to empty arrays
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory._id;
    const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryProductCount = (categoryId) => {
    return products.filter(product => product.category === categoryId).length;
  };

  if (loading) return <Loading message="Loading categories..." />;

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="categories-header">
        <h1>
          <FaTags /> Shop by Category
        </h1>
        <p>Explore our wide range of categories and find what you need</p>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs-container">
        <div className="category-tabs">
          <button
            className={`category-tab ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            <span className="tab-name">All Products</span>
            <span className="tab-count">{products.length}</span>
          </button>
          {categories.map(category => (
            <button
              key={category._id}
              className={`category-tab ${selectedCategory?._id === category._id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              <span className="tab-name">{category.name}</span>
              <span className="tab-count">{getCategoryProductCount(category._id)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search products in this category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
        {selectedCategory && (
          <div className="category-info">
            <h2>
              <FaTags /> {selectedCategory.name}
            </h2>
            <p>Browse {getCategoryProductCount(selectedCategory._id)} products in this category</p>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <FaTags />
            <h3>No products found</h3>
            <p>Try adjusting your search or category selection.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <article key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} className="product-image-link">
                  <div className="product-image">
                    <img
                      src={product.image ? `${import.meta.env.VITE_UPLOADS_URL}/${product.image}` : 'https://via.placeholder.com/300'}
                      alt={product.name}
                    />
                    <div className="product-overlay">
                      <span>View Details</span>
                    </div>
                  </div>
                </Link>

                <div className="product-content">
                  <Link to={`/product/${product._id}`} className="product-title-link">
                    <h3>{product.name}</h3>
                  </Link>

                  <div className="product-brand">{product.brand}</div>

                  <div className="product-rating">
                    <FaStar />
                    <span>{product.rating || 4.5}</span>
                    <span className="reviews">({product.numReviews || 0} reviews)</span>
                  </div>

                  <div className="product-price">
                    <span className="current-price">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">₹{product.originalPrice}</span>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    className="add-cart-btn"
                    onClick={() => {/* Add to cart logic */}}
                  >
                    <FaShoppingCart /> Add to Cart
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .categories-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .categories-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .categories-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .categories-header p {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .category-tabs-container {
          background: white;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .category-tabs {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 1200px;
          margin: 0 auto;
        }

        .category-tab {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-tab:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .category-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .tab-name {
          font-weight: 600;
        }

        .tab-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .search-container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-box {
          position: relative;
        }

        .search-box svg {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.25rem;
        }

        .search-box input {
          width: 100%;
          padding: 1rem 1.5rem 1rem 4rem;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .products-section {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .category-info {
          text-align: center;
          margin-bottom: 2rem;
        }

        .category-info h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .category-info p {
          color: #64748b;
          font-size: 1.1rem;
        }

        .no-products {
          text-align: center;
          padding: 4rem;
          color: #64748b;
        }

        .no-products svg {
          font-size: 4rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .no-products h3 {
          font-size: 1.5rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .product-image-link {
          display: block;
        }

        .product-image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.1);
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(102, 126, 234, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .product-overlay span {
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid white;
          border-radius: 50px;
        }

        .product-content {
          padding: 1.5rem;
        }

        .product-title-link {
          text-decoration: none;
          color: inherit;
        }

        .product-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .product-brand {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .product-rating svg {
          color: #fbbf24;
        }

        .product-rating span {
          font-weight: 600;
          color: #1e293b;
        }

        .product-rating .reviews {
          color: #64748b;
          font-weight: 400;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .current-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .original-price {
          color: #64748b;
          text-decoration: line-through;
          font-size: 1rem;
        }

        .add-cart-btn {
          width: 100%;
          padding: 0.875rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .categories-header {
            padding: 2rem 1rem;
          }

          .categories-header h1 {
            font-size: 2rem;
          }

          .category-tabs {
            flex-direction: column;
            align-items: stretch;
          }

          .category-tab {
            justify-content: space-between;
          }

          .search-container {
            padding: 1rem;
          }

          .products-section {
            padding: 1rem;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;
