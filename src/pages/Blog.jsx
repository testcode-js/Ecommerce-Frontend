import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBlog, FaCalendarAlt, FaUser, FaTag, FaSearch, FaClock, FaComments, FaShare, FaHeart, FaFilter, FaArrowRight, FaStar } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch blogs from API
        const { data: blogsData } = await API.get('/blogs', {
          params: {
            status: 'published',
            limit: 100
          }
        });
        
        // Fetch blog categories
        const { data: categoriesData } = await API.get('/blogs/categories');
        
        // Transform categories to include count
        const categoriesWithCount = categoriesData.map(category => ({
          _id: category,
          name: category,
          count: blogsData.blogs.filter(blog => blog.category === category).length
        }));
        
        setPosts(blogsData.blogs || []);
        setCategories(categoriesWithCount);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        // Fallback to empty arrays on error
        setPosts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      case 'popular':
        return b.likes - a.likes;
      case 'comments':
        return b.comments - a.comments;
      default:
        return 0;
    }
  });

  const featuredPosts = sortedPosts.filter(post => post.featured);
  const regularPosts = sortedPosts.filter(post => !post.featured);

  if (loading) return <Loading message="Loading blog posts..." />;

  return (
    <div className="blog-page">
      {/* Header Section */}
      <div className="blog-header">
        <div className="blog-hero">
          <div className="hero-content">
            <h1>
              <FaBlog /> Our Blog
            </h1>
            <p>Discover the latest trends, tips, and insights from our expert writers</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="blog-controls">
        <div className="control-section">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="control-section">
          <div className="filter-group">
            <FaFilter />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="control-section">
          <div className="sort-group">
            <FaClock />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="comments">Most Comments</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="featured-section">
          <h2>
            <FaStar /> Featured Articles
          </h2>
          <div className="featured-grid">
            {featuredPosts.map(post => (
              <article key={post._id} className="featured-card">
                <div className="featured-image">
                  <img src={post.featuredImage || 'https://placehold.co/800x400'} alt={post.title} />
                  <div className="featured-badge">Featured</div>
                </div>
                <div className="featured-content">
                  <div className="featured-meta">
                    <span className="category-tag">{post.category}</span>
                    <span className="read-time">{post.readTime}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="featured-footer">
                    <div className="author-info">
                      <img src={post.authorAvatar || 'https://placehold.co/50x50'} alt={post.author} />
                      <span>{post.author}</span>
                    </div>
                    <Link to={`/blog/${post._id}`} className="read-more">
                      Read More <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts Grid */}
      <div className="blog-content">
        <h2>
          {selectedCategory === 'all' ? 'All Articles' : `${selectedCategory} Articles`}
          {searchTerm && ` - "${searchTerm}"`}
        </h2>
        
        {regularPosts.length === 0 ? (
          <div className="no-posts">
            <FaBlog />
            <h3>No articles found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="blog-grid">
            {regularPosts.map(post => (
              <article key={post._id} className="blog-card">
                <div className="blog-image">
                  <img src={post.featuredImage || 'https://placehold.co/800x400'} alt={post.title} />
                  <div className="blog-overlay">
                    <Link to={`/blog/${post._id}`} className="overlay-link">
                      <FaSearch />
                    </Link>
                  </div>
                </div>
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="category-tag">{post.category}</span>
                    <span className="read-time">{post.readTime}</span>
                  </div>
                  
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  
                  <div className="blog-footer">
                    <div className="author-section">
                      <img src={post.authorAvatar || 'https://placehold.co/50x50'} alt={post.author} />
                      <div className="author-details">
                        <span className="author-name">{post.author}</span>
                        <span className="publish-date">
                          <FaCalendarAlt />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="blog-stats">
                      <span className="stat">
                        <FaHeart /> {post.likes}
                      </span>
                      <span className="stat">
                        <FaComments /> {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h2>
            <FaBlog /> Stay Updated
          </h2>
          <p>Get the latest articles delivered straight to your inbox</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <Button variant="primary">Subscribe</Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .blog-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .blog-hero h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .blog-hero p {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .blog-controls {
          background: white;
          padding: 2rem;
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .control-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-box svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filter-group, .sort-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-select, .sort-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
        }

        .featured-section {
          padding: 3rem 2rem;
          background: white;
          margin: 2rem 0;
        }

        .featured-section h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .featured-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .featured-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .featured-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .featured-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .featured-content {
          padding: 2rem;
        }

        .featured-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .category-tag {
          background: #f0f4ff;
          color: #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .read-time {
          color: #64748b;
          font-size: 0.875rem;
        }

        .featured-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .featured-content p {
          color: #475569;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .featured-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-info img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .read-more {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .read-more:hover {
          color: #764ba2;
          transform: translateX(4px);
        }

        .blog-content {
          padding: 3rem 2rem;
        }

        .blog-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2rem;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .blog-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .blog-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .blog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .blog-card:hover .blog-image img {
          transform: scale(1.05);
        }

        .blog-overlay {
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

        .blog-card:hover .blog-overlay {
          opacity: 1;
        }

        .overlay-link {
          color: white;
          font-size: 2rem;
          text-decoration: none;
        }

        .blog-card .blog-content {
          padding: 1.5rem;
        }

        .blog-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .blog-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .blog-card p {
          color: #475569;
          line-height: 1.5;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .blog-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-section img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-details {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
        }

        .publish-date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #64748b;
          font-size: 0.8rem;
        }

        .blog-stats {
          display: flex;
          gap: 1rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #64748b;
          font-size: 0.875rem;
        }

        .newsletter-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
          margin-top: 4rem;
        }

        .newsletter-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .newsletter-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .newsletter-form {
          display: flex;
          gap: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .newsletter-form input {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
        }

        .no-posts {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .no-posts svg {
          font-size: 4rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .no-posts h3 {
          font-size: 1.5rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .blog-header {
            padding: 2rem 1rem;
          }

          .blog-hero h1 {
            font-size: 2rem;
          }

          .blog-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .control-section {
            width: 100%;
            justify-content: space-between;
          }

          .search-box {
            max-width: 100%;
          }

          .featured-grid,
          .blog-grid {
            grid-template-columns: 1fr;
          }

          .featured-footer,
          .blog-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .newsletter-form {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Blog;
