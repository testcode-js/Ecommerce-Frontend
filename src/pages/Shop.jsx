import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaTimes, FaSearch, FaSort } from 'react-icons/fa';
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import API from '../api/axios';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', 12);
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      if (sortBy) params.set('sort', sortBy);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);

      const { data } = await API.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, sortBy, searchQuery, minPrice, maxPrice]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = selectedCategory || searchQuery || sortBy !== 'newest' || minPrice || maxPrice;

  return (
    <div className="modern-shop">
      <div className="container">
        {/* Shop Header */}
        <div className="shop-header">
          <div className="shop-title">
            <h1>
              {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="results-count">{total} products found</p>
          </div>
          
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filters
            {hasActiveFilters && <span className="filter-badge"></span>}
          </button>
        </div>

        <div className="shop-content">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <div className="filters-actions">
                {hasActiveFilters && (
                  <button className="clear-filters-btn" onClick={handleClearFilters}>
                    <FaTimes /> Clear All
                  </button>
                )}
                <button 
                  className="close-filters-btn"
                  onClick={() => setShowFilters(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="filters-content">
              {/* Search */}
              <div className="filter-group">
                <label className="filter-label">
                  <FaSearch /> Search
                </label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                />
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  className="filter-select"
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <label className="filter-label">Price Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                  />
                  <span className="price-separator">-</span>
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="filter-group">
                <label className="filter-label">
                  <FaSort /> Sort By
                </label>
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="bestselling">Best Selling</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {loading ? (
              <Loading message="Loading products..." />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn btn-primary" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product._id} className="product-wrapper">
                      <Card product={product} />
                    </div>
                  ))}
                </div>
                <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .modern-shop {
          padding: 2rem 0;
          min-height: 80vh;
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .shop-title h1 {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .results-count {
          color: #636e72;
          font-size: 1rem;
          margin: 0;
        }

        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background: #fff;
          border: 2px solid #e9ecef;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          color: #636e72;
          transition: all 0.3s ease;
          position: relative;
        }

        .filter-toggle-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .filter-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #ff4757;
          border-radius: 50%;
        }

        .shop-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }

        .filters-sidebar {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 1.5rem;
          height: fit-content;
          position: sticky;
          top: 100px;
          transition: all 0.3s ease;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .filters-header h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2d3436;
          margin: 0;
        }

        .filters-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .clear-filters-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: none;
          border: none;
          color: #ff4757;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .close-filters-btn {
          display: none;
          background: none;
          border: none;
          color: #636e72;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #2d3436;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .filter-input,
        .filter-select {
          width: 100%;
          padding: 0.8rem;
          border: 2px solid #f0f0f0;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-separator {
          color: #636e72;
          font-weight: 600;
        }

        .products-main {
          min-height: 60vh;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .product-wrapper {
          animation: fadeInUp 0.6s ease;
          animation-fill-mode: both;
        }

        .product-wrapper:nth-child(1) { animation-delay: 0.1s; }
        .product-wrapper:nth-child(2) { animation-delay: 0.2s; }
        .product-wrapper:nth-child(3) { animation-delay: 0.3s; }
        .product-wrapper:nth-child(4) { animation-delay: 0.4s; }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #2d3436;
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: #636e72;
          margin-bottom: 2rem;
        }

        .btn {
          padding: 0.8rem 2rem;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102,126,234,0.4);
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

        @media (max-width: 1024px) {
          .shop-content {
            grid-template-columns: 280px 1fr;
          }
        }

        @media (max-width: 768px) {
          .modern-shop {
            padding: 1rem 0;
          }

          .shop-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .shop-title h1 {
            font-size: 1.5rem;
          }

          .shop-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .filters-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 80%;
            height: 100vh;
            background: #fff;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            z-index: 1000;
            border-radius: 0;
            overflow-y: auto;
          }

          .filters-sidebar.open {
            left: 0;
          }

          .close-filters-btn {
            display: block;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Shop;
