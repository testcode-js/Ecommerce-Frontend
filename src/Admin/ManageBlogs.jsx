import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter, FaCalendarAlt, FaUser, FaTag, FaBlog } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockBlogs = [
        {
          _id: '1',
          title: 'Getting Started with React Development',
          excerpt: 'Learn the basics of React and start building modern web applications with this comprehensive guide.',
          author: 'John Doe',
          category: 'Technology',
          tags: ['react', 'javascript', 'web development'],
          status: 'published',
          featuredImage: 'https://via.placeholder.com/300x200',
          createdAt: '2024-01-15',
          publishDate: '2024-01-16',
          views: 1250,
          likes: 45
        },
        {
          _id: '2',
          title: '10 Fashion Trends for 2024',
          excerpt: 'Discover the hottest fashion trends that will dominate the year 2024.',
          author: 'Jane Smith',
          category: 'Fashion',
          tags: ['fashion', 'trends', '2024'],
          status: 'published',
          featuredImage: 'https://via.placeholder.com/300x200',
          createdAt: '2024-01-10',
          publishDate: '2024-01-12',
          views: 890,
          likes: 32
        },
        {
          _id: '3',
          title: 'Healthy Eating Habits for Busy Professionals',
          excerpt: 'Simple and effective nutrition tips for professionals with busy schedules.',
          author: 'Dr. Sarah Johnson',
          category: 'Health',
          tags: ['health', 'nutrition', 'lifestyle'],
          status: 'draft',
          featuredImage: 'https://via.placeholder.com/300x200',
          createdAt: '2024-01-08',
          publishDate: '',
          views: 0,
          likes: 0
        }
      ];
      
      setBlogs(mockBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 500));
        setBlogs(blogs.filter(blog => blog._id !== blogId));
        console.log('Blog deleted:', blogId);
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleStatusToggle = async (blogId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      setBlogs(blogs.map(blog => 
        blog._id === blogId ? { ...blog, status: newStatus } : blog
      ));
      console.log('Blog status updated:', blogId, newStatus);
    } catch (error) {
      console.error('Error updating blog status:', error);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || blog.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'views':
        return b.views - a.views;
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
        <h2>Manage Blog Posts</h2>
        <Link to="/admin/add-blog" className="btn btn-primary">
          <FaPlus /> Add New Blog
        </Link>
      </div>

      <div className="content-card">
        <div className="filters-section">
          <div className="filter-group">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search blogs..."
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
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="health">Health</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
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
              <option value="author">Author (A-Z)</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Blog Post</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <div className="blog-info">
                      {blog.featuredImage && (
                        <img 
                          src={blog.featuredImage} 
                          alt={blog.title}
                          className="blog-thumbnail"
                        />
                      )}
                      <div className="blog-details">
                        <h4>{blog.title}</h4>
                        <p>{blog.excerpt}</p>
                        <div className="blog-tags">
                          {blog.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="author-info">
                      <FaUser />
                      <span>{blog.author}</span>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{blog.category}</span>
                  </td>
                  <td>
                    <button
                      className={`status-badge ${blog.status}`}
                      onClick={() => handleStatusToggle(blog._id, blog.status)}
                    >
                      {blog.status}
                    </button>
                  </td>
                  <td>{blog.views.toLocaleString()}</td>
                  <td>{blog.likes}</td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/blog/${blog._id}`} className="btn btn-sm btn-info">
                        <FaEye />
                      </Link>
                      <Link to={`/admin/edit-blog/${blog._id}`} className="btn btn-sm btn-warning">
                        <FaEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(blog._id)}
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

        {sortedBlogs.length === 0 && (
          <div className="no-data">
            <FaBlog />
            <h3>No blog posts found</h3>
            <p>Try adjusting your filters or create a new blog post.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;
