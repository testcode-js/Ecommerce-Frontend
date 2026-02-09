import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import Button from '../components/Button';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  if (loading) return <Loading message="Loading wishlist..." />;

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <FaHeart className="me-2 text-danger" />
        My Wishlist ({wishlistItems.length} items)
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <FaHeart size={60} className="text-muted mb-3" />
          <h5>Your wishlist is empty</h5>
          <p className="text-muted">Save items you love by clicking the heart icon on products.</p>
          <Link to="/shop">
            <Button title="Browse Products" />
          </Link>
        </div>
      ) : (
        <div className="row">
          {wishlistItems.map((product) => (
            <div key={product._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image ? `${UPLOADS_URL}/${product.image}` : 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                </Link>

                <div className="card-body d-flex flex-column">
                  <Link to={`/product/${product._id}`} className="text-decoration-none">
                    <h5 className="card-title text-dark">{product.name}</h5>
                  </Link>

                  {product.brand && (
                    <p className="text-muted small mb-2">{product.brand}</p>
                  )}

                  <div className="mb-3">
                    <span className="fs-5 fw-bold text-primary">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-muted text-decoration-line-through ms-2">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className={`mb-3 ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-primary flex-grow-1"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleRemove(product._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
