import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaImage, FaCalendarAlt, FaUser, FaTag, FaHeading, FaAlignLeft } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    tags: '',
    category: '',
    featuredImage: '',
    status: 'draft',
    publishDate: ''
  });

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock blog data
      const mockBlog = {
        _id: id,
        title: 'Getting Started with React Development',
        content: 'React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we will explore the fundamentals of React development, including components, state management, hooks, and best practices.\n\n## Getting Started\n\nTo begin your React journey, you need to understand the core concepts:\n\n1. **Components**: The building blocks of React applications\n2. **Props**: How components communicate with each other\n3. **State**: Managing data within components\n4. **Hooks**: Modern React features for state and side effects\n\n## Creating Your First Component\n\n```jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n```\n\nThis simple component demonstrates the basic structure of a React functional component.',
        excerpt: 'Learn the basics of React and start building modern web applications with this comprehensive guide.',
        author: 'John Doe',
        tags: 'react, javascript, web development',
        category: 'technology',
        featuredImage: 'https://via.placeholder.com/800x400',
        status: 'published',
        publishDate: '2024-01-16'
      };
      
      setFormData({
        title: mockBlog.title,
        content: mockBlog.content,
        excerpt: mockBlog.excerpt,
        author: mockBlog.author,
        tags: mockBlog.tags,
        category: mockBlog.category,
        featuredImage: mockBlog.featuredImage,
        status: mockBlog.status,
        publishDate: mockBlog.publishDate
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      navigate('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Blog updated:', { id, ...formData });
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/blogs');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Edit Blog Post</h2>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleCancel}>
            <FaTimes /> Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            <FaSave /> {saving ? 'Saving...' : 'Update Blog'}
          </button>
        </div>
      </div>

      <div className="content-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaHeading /> Blog Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <FaUser /> Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author name"
                required
              />
            </div>
          </div>

          <div className="form-row">
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
            <div className="form-group">
              <label>
                <FaTag /> Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Comma-separated tags"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaAlignLeft /> Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief description of the blog post"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>
              <FaAlignLeft /> Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows="12"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaImage /> Featured Image URL
              </label>
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-group">
              <label>
                <FaCalendarAlt /> Publish Date
              </label>
              <input
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <FaSave /> {saving ? 'Saving...' : 'Update Blog Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
