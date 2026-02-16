import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart, FaMinus, FaPlus, FaFileInvoice } from 'react-icons/fa';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import Loading from '../components/Loading';
import Button from '../components/Button';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setSelectedImageIndex(0); // Reset to first image when product loads
    } catch (err) {
      console.error('Fetch product error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllImages = (product) => {
    const images = [];
    
    // Handle main image - check if it's a Cloudinary URL or local path
    if (product.image) {
      if (product.image.startsWith('http')) {
        // Cloudinary URL - use as is
        images.push(product.image);
      } else {
        // Local file path - prepend UPLOADS_URL
        images.push(`${UPLOADS_URL}/${product.image}`);
      }
    }
    
    // Handle additional images - check if they are Cloudinary URLs or local paths
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img) {
          if (img.startsWith('http')) {
            // Cloudinary URL - use as is
            images.push(img);
          } else {
            // Local file path - prepend UPLOADS_URL
            images.push(`${UPLOADS_URL}/${img}`);
          }
        }
      });
    }
    
    return images.length > 0 ? images : ['https://placehold.co/500'];
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        stock: product.stock,
      },
      quantity
    );
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }
    try {
      setReviewLoading(true);
      await API.post(`/products/${id}/reviews`, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      fetchProduct();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loading message="Loading product..." />;
  if (!product) return <div className="container my-5 text-center"><h4>Product not found</h4><Link to="/shop">Back to Shop</Link></div>;

  const allImages = getAllImages(product);
  const currentImage = allImages[selectedImageIndex] || 'https://placehold.co/500';
  const categoryName = typeof product.category === 'object' ? product.category?.name : 'N/A';
  const isOutOfStock = product.stock <= 0;
  const inWishlist = isInWishlist(product._id);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row mb-5">
        <div className="col-lg-5">
          {/* Main Image Display */}
          <div className="position-relative mb-3">
            {discount > 0 && (
              <span className="badge bg-danger position-absolute" style={{ top: 10, left: 10, fontSize: '1rem', zIndex: 10 }}>
                {discount}% OFF
              </span>
            )}
            <img 
              src={currentImage} 
              alt={product.name} 
              className="img-fluid rounded shadow" 
              style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }} 
            />
          </div>
          
          {/* Image Thumbnails */}
          {allImages.length > 1 && (
            <div className="row g-2">
              {allImages.map((image, index) => (
                <div key={index} className="col-3">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`img-thumbnail rounded cursor-pointer ${selectedImageIndex === index ? 'border-primary border-2' : ''}`}
                    style={{ 
                      height: '80px', 
                      width: '100%', 
                      objectFit: 'cover',
                      opacity: selectedImageIndex === index ? 1 : 0.7,
                      border: selectedImageIndex === index ? '2px solid #0d6efd' : '1px solid #dee2e6'
                    }}
                    onClick={() => handleImageSelect(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-7">
          <h2 className="mb-2">{product.name}</h2>

          <div className="mb-2">
            <StarRating rating={product.rating || 0} numReviews={product.numReviews || 0} size={18} />
          </div>

          <p className="text-muted mb-2">
            <span className="me-3">Category: <strong>{categoryName}</strong></span>
            {product.brand && <span>Brand: <strong>{product.brand}</strong></span>}
          </p>

          <div className="mb-3">
            <span className="fs-3 fw-bold text-primary">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through ms-2">₹{product.originalPrice}</span>
            )}
          </div>

          <p className="text-muted mb-3">{product.description}</p>

          <p className={`mb-3 ${isOutOfStock ? 'text-danger' : 'text-success'}`}>
            {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.stock} available`}
          </p>

          {!isOutOfStock && (
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="d-flex align-items-center border rounded">
                <button className="btn btn-light" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>
                  <FaMinus size={12} />
                </button>
                <span className="px-3 fw-bold">{quantity}</span>
                <button className="btn btn-light" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
          )}

          <div className="d-flex gap-3 mb-4">
            <Button
              title={<><FaShoppingCart className="me-2" />{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</>}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            />
            <button className={`btn ${inWishlist ? 'btn-danger' : 'btn-outline-danger'}`} onClick={handleToggleWishlist}>
              {inWishlist ? <FaHeart className="me-2" /> : <FaRegHeart className="me-2" />}
              {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

        </div>
      </div>

      <hr />

      {/* Reviews Section */}
      <div className="row mt-4">
        <div className="col-lg-6">
          <h4 className="mb-3">Customer Reviews ({product.reviews?.length || 0})</h4>
          {product.reviews?.length > 0 ? (
            product.reviews.slice().reverse().map((rev, idx) => (
              <div key={idx} className="mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>{rev.name}</strong>
                  <StarRating rating={rev.rating} showCount={false} size={14} />
                </div>
                <p className="mb-1">{rev.comment}</p>
                <small className="text-muted">{new Date(rev.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          ) : (
            <p className="text-muted">No reviews yet. Be the first to review!</p>
          )}
        </div>

        <div className="col-lg-6">
          <h4 className="mb-3">Write a Review</h4>
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select
                  className="form-select"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Your Review</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Share your experience with this product..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p className="text-muted">Please <Link to="/login">login</Link> to write a review.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
