import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaCalendarAlt, FaUser, FaTag, FaEye, FaHeart, FaShare } from 'react-icons/fa';
import API from '../api/axios';
import Loading from '../components/Loading';
import './AdminLayout.css';

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);

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
        content: `React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we will explore the fundamentals of React development, including components, state management, hooks, and best practices.

## Getting Started

To begin your React journey, you need to understand the core concepts:

1. **Components**: The building blocks of React applications
2. **Props**: How components communicate with each other
3. **State**: Managing data within components
4. **Hooks**: Modern React features for state and side effects

## Creating Your First Component

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

This simple component demonstrates the basic structure of a React functional component.

## Understanding Props

Props (short for "properties") are how components receive data from their parent components. They are read-only and help make components reusable.

## State Management

State is how components manage and update data over time. With the introduction of hooks, functional components can now use state with the useState hook.

## React Hooks

Hooks revolutionized React by allowing functional components to use state and other React features. Some common hooks include:

- useState: For managing component state
- useEffect: For side effects
- useContext: For consuming context
- useReducer: For complex state logic

## Best Practices

When developing React applications, follow these best practices:

1. Keep components small and focused
2. Use functional components with hooks
3. Implement proper error boundaries
4. Optimize performance with React.memo
5. Follow consistent naming conventions

## Conclusion

React provides a powerful and flexible way to build modern web applications. By understanding these fundamentals, you'll be well on your way to becoming a proficient React developer.`,
        excerpt: 'Learn the basics of React and start building modern web applications with this comprehensive guide.',
        author: 'John Doe',
        tags: ['react', 'javascript', 'web development'],
        category: 'Technology',
        featuredImage: 'https://placehold.co/800x400',
        status: 'published',
        publishDate: '2024-01-16',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        views: 1250,
        likes: 45
      };
      
      setBlog(mockBlog);
    } catch (error) {
      console.error('Error fetching blog:', error);
      navigate('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Blog deleted:', id);
        navigate('/admin/blogs');
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const formatContent = (content) => {
    // Simple markdown-like formatting for demonstration
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('##')) {
          return <h2 key={index}>{line.replace('##', '').trim()}</h2>;
        } else if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.')) {
          return <li key={index}>{line.replace(/^\d+\.\s*/, '')}</li>;
        } else if (line.startsWith('-')) {
          return <li key={index}>{line.replace('- ', '')}</li>;
        } else if (line.includes('```')) {
          return null; // Skip code blocks for simplicity
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index}>{line}</p>;
        }
      });
  };

  if (loading) {
    return <Loading />;
  }

  if (!blog) {
    return (
      <div className="admin-page">
        <div className="content-card">
          <div className="no-data">
            <h3>Blog post not found</h3>
            <Link to="/admin/blogs" className="btn btn-primary">
              Back to Blogs
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
          <Link to="/admin/blogs" className="breadcrumb-link">
            <FaArrowLeft /> Back to Blogs
          </Link>
        </div>
        <div className="page-actions">
          <Link to={`/admin/edit-blog/${blog._id}`} className="btn btn-warning">
            <FaEdit /> Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="content-card">
        <article className="blog-post-view">
          <header className="blog-header">
            <h1 className="blog-title">{blog.title}</h1>
            
            <div className="blog-meta">
              <div className="meta-item">
                <FaUser />
                <span>{blog.author}</span>
              </div>
              <div className="meta-item">
                <FaCalendarAlt />
                <span>Published: {new Date(blog.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <span className={`status-badge ${blog.status}`}>
                  {blog.status}
                </span>
              </div>
            </div>

            <div className="blog-stats">
              <div className="stat-item">
                <FaEye />
                <span>{blog.views.toLocaleString()} views</span>
              </div>
              <div className="stat-item">
                <FaHeart />
                <span>{blog.likes} likes</span>
              </div>
            </div>
          </header>

          {blog.featuredImage && (
            <div className="blog-image">
              <img src={blog.featuredImage} alt={blog.title} />
            </div>
          )}

          <div className="blog-excerpt">
            <p><strong>{blog.excerpt}</strong></p>
          </div>

          <div className="blog-content">
            {formatContent(blog.content)}
          </div>

          <footer className="blog-footer">
            <div className="blog-tags">
              <FaTag />
              {blog.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>

            <div className="blog-info">
              <div className="info-item">
                <strong>Category:</strong> {blog.category}
              </div>
              <div className="info-item">
                <strong>Created:</strong> {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              <div className="info-item">
                <strong>Last Updated:</strong> {new Date(blog.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default ViewBlog;
