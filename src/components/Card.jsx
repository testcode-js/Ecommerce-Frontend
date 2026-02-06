import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaHeart, FaShoppingCart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartCOntext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const Card = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const { _id, name, price, originalPrice, image, brand, category, rating, numReviews, stock } = product;

  const imgUrl = image ? `${UPLOADS_URL}/${image}` : 'https://via.placeholder.com/400x400?text=No+Image';
  const categoryName = typeof category === 'object' ? category?.name : category;
  const isOutOfStock = stock !== undefined && stock <= 0;
  const inWishlist = isInWishlist(_id);
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ _id, name, price, image, brand, stock });
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }
    if (inWishlist) {
      await removeFromWishlist(_id);
    } else {
      await addToWishlist(_id);
    }
  };

  const cardStyle = {
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: isHovered 
      ? '0 20px 40px rgba(0,0,0,0.15)' 
      : '0 4px 15px rgba(0,0,0,0.08)',
    border: 'none',
    background: '#fff',
  };

  const imageContainerStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
  };

  const imageStyle = {
    height: '220px',
    width: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
  };

  const actionButtonsStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    gap: '10px',
    opacity: isHovered ? 1 : 0,
    transition: 'all 0.3s ease',
    zIndex: 3,
  };

  const iconBtnStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  };

  return (
    <div 
      className="card h-100"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div style={imageContainerStyle}>
        {/* Badges */}
        <div className="position-absolute d-flex flex-column gap-2" style={{ top: '12px', left: '12px', zIndex: 4 }}>
          {discount > 0 && (
            <span 
              className="badge"
              style={{ 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(238,90,90,0.4)'
              }}
            >
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span 
              className="badge"
              style={{ 
                background: 'linear-gradient(135deg, #ffd93d 0%, #ff9500 100%)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#000'
              }}
            >
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div 
            className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ 
              background: 'rgba(0,0,0,0.5)', 
              zIndex: 2,
              backdropFilter: 'blur(2px)'
            }}
          >
            <span 
              className="badge fs-6"
              style={{ 
                background: 'rgba(255,255,255,0.95)',
                color: '#dc3545',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: '600'
              }}
            >
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Button (Always Visible) */}
        <button
          onClick={handleToggleWishlist}
          className="position-absolute"
          style={{
            ...iconBtnStyle,
            top: '12px',
            right: '12px',
            background: inWishlist ? '#ff4757' : 'rgba(255,255,255,0.95)',
            color: inWishlist ? '#fff' : '#ff4757',
            width: '38px',
            height: '38px',
            zIndex: 5,
          }}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {inWishlist ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>

        <Link to={`/product/${_id}`}>
          <img src={imgUrl} alt={name} style={imageStyle} />
        </Link>

        {/* Hover Action Buttons */}
        <div style={actionButtonsStyle}>
          <Link 
            to={`/product/${_id}`}
            style={{
              ...iconBtnStyle,
              background: '#fff',
              color: '#333',
              textDecoration: 'none',
            }}
            title="Quick View"
          >
            <FaEye size={18} />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              ...iconBtnStyle,
              background: isOutOfStock ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
            }}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            <FaShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body" style={{ padding: '20px' }}>
        {/* Category */}
        <div className="mb-2">
          <span 
            style={{ 
              fontSize: '11px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              color: '#667eea',
              fontWeight: '600',
              background: 'rgba(102,126,234,0.1)',
              padding: '4px 10px',
              borderRadius: '12px',
            }}
          >
            {categoryName || 'General'}
          </span>
        </div>

        {/* Product Name */}
        <Link to={`/product/${_id}`} className="text-decoration-none">
          <h6 
            className="card-title mb-2"
            style={{ 
              fontSize: '15px',
              fontWeight: '600',
              color: '#2d3436',
              lineHeight: '1.4',
              minHeight: '42px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = '#667eea'}
            onMouseLeave={(e) => e.target.style.color = '#2d3436'}
          >
            {name}
          </h6>
        </Link>

        {/* Brand */}
        {brand && (
          <p className="mb-2" style={{ fontSize: '12px', color: '#95a5a6' }}>
            by <span style={{ fontWeight: '500', color: '#636e72' }}>{brand}</span>
          </p>
        )}

        {/* Rating */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <div 
            className="d-flex align-items-center gap-1"
            style={{ 
              background: rating >= 4 ? '#00b894' : rating >= 3 ? '#fdcb6e' : '#e17055',
              padding: '3px 8px',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            <FaStar size={10} />
            <span>{rating?.toFixed(1) || '0.0'}</span>
          </div>
          <span style={{ fontSize: '12px', color: '#95a5a6' }}>
            ({numReviews || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span 
              style={{ 
                fontSize: '22px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ₹{price?.toLocaleString()}
            </span>
            {originalPrice > price && (
              <span 
                className="ms-2"
                style={{ 
                  fontSize: '14px', 
                  color: '#b2bec3',
                  textDecoration: 'line-through'
                }}
              >
                ₹{originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button (Mobile Friendly) */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="btn w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
          style={{
            background: isOutOfStock 
              ? '#dfe6e9' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: isOutOfStock ? '#636e72' : '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: isOutOfStock ? 'none' : '0 4px 15px rgba(102,126,234,0.4)',
          }}
          onMouseEnter={(e) => {
            if (!isOutOfStock) {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = isOutOfStock ? 'none' : '0 4px 15px rgba(102,126,234,0.4)';
          }}
        >
          <FaShoppingCart size={16} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default Card;
