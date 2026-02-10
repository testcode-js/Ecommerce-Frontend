import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaCheck, 
  FaTrash, 
  FaFilter, 
  FaSearch, 
  FaShoppingCart, 
  FaBox, 
  FaTag, 
  FaHeart, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaGift,
  FaTruck,
  FaCreditCard,
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
  FaInbox,
  FaArchive
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loading from '../components/Loading';
import Button from '../components/Button';

const Notifications = () => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [user, isAuthenticated]); // Refetch when user changes

  const fetchNotifications = async () => {
    try {
      if (!isAuthenticated) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      // Mock API call - replace with actual API
      // const { data } = await API.get('/notifications');
      
      // Mock notifications data - in real implementation, this would come from the API
      const mockNotifications = [
        {
          _id: '1',
          type: 'order',
          title: 'Order Confirmed',
          message: 'Your order #12345 has been confirmed and is being processed.',
          icon: FaShoppingCart,
          color: '#10b981',
          isRead: false,
          createdAt: '2024-01-15T10:30:00',
          actionUrl: '/orders/12345',
          priority: 'high',
          userId: user?._id // User-specific notification
        },
        {
          _id: '2',
          type: 'shipping',
          title: 'Order Shipped',
          message: 'Your order #12345 has been shipped and will arrive in 2-3 days.',
          icon: FaTruck,
          color: '#3b82f6',
          isRead: false,
          createdAt: '2024-01-14T15:45:00',
          actionUrl: '/orders/12345',
          priority: 'medium',
          userId: user?._id // User-specific notification
        },
        {
          _id: '3',
          type: 'deal',
          title: 'Flash Sale Alert',
          message: 'Get 50% off on electronics! Limited time offer.',
          icon: FaTag,
          color: '#f59e0b',
          isRead: true,
          createdAt: '2024-01-13T09:00:00',
          actionUrl: '/deals',
          priority: 'high',
          userId: user?._id // User-specific notification
        },
        {
          _id: '4',
          type: 'wishlist',
          title: 'Price Drop Alert',
          message: 'An item in your wishlist is now on sale!',
          icon: FaHeart,
          color: '#ef4444',
          isRead: true,
          createdAt: '2024-01-12T14:20:00',
          actionUrl: '/wishlist',
          priority: 'medium',
          userId: user?._id // User-specific notification
        },
        {
          _id: '5',
          type: 'payment',
          title: 'Payment Successful',
          message: 'Your payment for order #12344 has been processed successfully.',
          icon: FaCreditCard,
          color: '#10b981',
          isRead: true,
          createdAt: '2024-01-11T11:15:00',
          actionUrl: '/orders/12344',
          priority: 'low',
          userId: user?._id // User-specific notification
        },
        {
          _id: '6',
          type: 'system',
          title: 'Account Update',
          message: 'Your profile information has been updated successfully.',
          icon: FaUser,
          color: '#6b7280',
          isRead: true,
          createdAt: '2024-01-10T16:30:00',
          actionUrl: '/profile',
          priority: 'low',
          userId: user?._id // User-specific notification
        },
        {
          _id: '7',
          type: 'promotion',
          title: 'Special Offer',
          message: 'Exclusive 20% discount for loyal customers like you!',
          icon: FaGift,
          color: '#8b5cf6',
          isRead: false,
          createdAt: '2024-01-09T12:00:00',
          actionUrl: '/deals',
          priority: 'medium',
          userId: user?._id // User-specific notification
        },
        {
          _id: '8',
          type: 'delivery',
          title: 'Order Delivered',
          message: 'Your order #12343 has been delivered successfully.',
          icon: FaBox,
          color: '#10b981',
          isRead: true,
          createdAt: '2024-01-08T18:45:00',
          actionUrl: '/orders/12343',
          priority: 'low',
          userId: user?._id // User-specific notification
        }
      ];
      
      // Filter notifications for the current user
      const userNotifications = mockNotifications.filter(notif => 
        !notif.userId || notif.userId === user?._id
      );
      
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Show empty state on error
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setNotifications(prev => 
        prev.filter(notif => notif._id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteSelectedNotifications = async () => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => 
        prev.filter(notif => !selectedNotifications.includes(notif._id))
      );
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Error deleting selected notifications:', error);
    }
  };

  const toggleSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(notif => notif._id));
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      order: FaShoppingCart,
      shipping: FaTruck,
      deal: FaTag,
      wishlist: FaHeart,
      payment: FaCreditCard,
      system: FaUser,
      promotion: FaGift,
      delivery: FaBox
    };
    return iconMap[type] || FaInfoCircle;
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      order: '#10b981',
      shipping: '#3b82f6',
      deal: '#f59e0b',
      wishlist: '#ef4444',
      payment: '#10b981',
      system: '#6b7280',
      promotion: '#8b5cf6',
      delivery: '#10b981'
    };
    return colorMap[type] || '#6b7280';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'read' && notif.isRead) ||
                         (filter === 'unread' && !notif.isRead) ||
                         (filter === 'high' && notif.priority === 'high');
    
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>
              <FaBell /> Notifications
              {unreadCount > 0 && (
                <span className="unread-count">{unreadCount}</span>
              )}
            </h1>
            <p>Stay updated with your orders, deals, and account activities</p>
          </div>
          <div className="header-actions">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={markAllAsRead}
                className="mark-all-read-btn"
              >
                <FaCheck /> Mark All as Read
              </Button>
            )}
            {selectedNotifications.length > 0 && (
              <Button 
                variant="danger" 
                onClick={deleteSelectedNotifications}
                className="delete-selected-btn"
              >
                <FaTrash /> Delete Selected ({selectedNotifications.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="notifications-filters">
        <div className="filter-group">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="filter-group">
          <Button
            variant="outline"
            onClick={selectAll}
            className="select-all-btn"
          >
            {selectedNotifications.length === filteredNotifications.length ? 
              'Deselect All' : 'Select All'}
          </Button>
        </div>
      </div>

      <div className="notifications-container">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <FaInbox />
            <h3>No notifications found</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'You\'re all caught up! No new notifications.'
              }
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''} ${notification.priority}`}
                >
                  <div className="notification-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification._id)}
                      onChange={() => toggleSelection(notification._id)}
                    />
                  </div>
                  
                  <div 
                    className="notification-icon"
                    style={{ backgroundColor: notification.color }}
                  >
                    <Icon />
                  </div>

                  <div className="notification-content">
                    <div className="notification-header">
                      <h3>{notification.title}</h3>
                      <div className="notification-meta">
                        <span className="time">
                          <FaCalendarAlt />
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {notification.priority === 'high' && (
                          <span className="priority-badge high">
                            <FaExclamationTriangle />
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="notification-message">{notification.message}</p>
                    
                    {notification.actionUrl && (
                      <Link 
                        to={notification.actionUrl}
                        className="notification-action"
                        onClick={() => markAsRead(notification._id)}
                      >
                        View Details →
                      </Link>
                    )}
                  </div>

                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="action-btn mark-read"
                        onClick={() => markAsRead(notification._id)}
                        title="Mark as read"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={() => deleteNotification(notification._id)}
                      title="Delete notification"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="notifications-footer">
        <div className="footer-info">
          <p>
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </p>
          {unreadCount > 0 && (
            <p className="unread-info">
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <div className="footer-actions">
          <Button
            variant="outline"
            onClick={() => setNotifications([])}
            className="clear-all-btn"
          >
            <FaArchive /> Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
