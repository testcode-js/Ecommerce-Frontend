import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaTrash, 
  FaFilter, 
  FaSearch, 
  FaSortAmountDown,
  FaSortAmountUp,
  FaRegHeart,
  FaShare,
  FaEye,
  FaBell,
  FaHeartBroken
} from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import Button from '../components/Button';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleToggleWishlist = async (product) => {
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    }
  };

  const handleSelectItem = (productId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item._id)));
    }
  };

  const handleAddSelectedToCart = () => {
    selectedItems.forEach(productId => {
      const product = filteredItems.find(item => item._id === productId);
      if (product) {
        addToCart(product, 1);
      }
    });
    setSelectedItems(new Set());
  };

  const handleRemoveSelected = async () => {
    for (const productId of selectedItems) {
      await removeFromWishlist(productId);
    }
    setSelectedItems(new Set());
  };

  const handleShareWishlist = () => {
    const wishlistUrl = `${window.location.origin}/wishlist/${wishlistItems.map(item => item._id).join(',')}`;
    navigator.clipboard.writeText(wishlistUrl);
    alert('Wishlist link copied to clipboard!');
  };

  const handleNotifyMe = (productId) => {
    // Implement notification logic
    alert('You will be notified when this item is back in stock!');
  };

  const filteredAndSortedItems = () => {
    let filtered = wishlistItems;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredItems = filteredAndSortedItems();

  if (loading) return <Loading message="Loading wishlist..." />;

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FaHeart className="me-2 text-danger" />
          My Wishlist ({wishlistItems.length} items)
        </h2>
        <div className="d-flex gap-2">
          <Button 
            title={<FaShare />}
            onClick={handleShareWishlist}
            className="btn-outline-secondary"
            disabled={wishlistItems.length === 0}
          />
          <Button 
            title={<FaFilter />}
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline-secondary ${showFilters ? 'active' : ''}`}
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search wishlist items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="col-md-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="date">Sort by Date Added</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="col-md-3">
                <Button
                  title={sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                  onClick={toggleSortOrder}
                  className="btn-outline-secondary w-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {filteredItems.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedItems.size === filteredItems.length}
                  onChange={handleSelectAll}
                />
                <span>Select all ({selectedItems.size} selected)</span>
              </div>
              <div className="d-flex gap-2">
                <Button
                  title="Add Selected to Cart"
                  onClick={handleAddSelectedToCart}
                  className="btn-outline-primary"
                  disabled={selectedItems.size === 0}
                />
                <Button
                  title="Remove Selected"
                  onClick={handleRemoveSelected}
                  className="btn-outline-danger"
                  disabled={selectedItems.size === 0}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <FaHeart size={60} className="text-muted mb-3" />
          <h5>Your wishlist is empty</h5>
          <p className="text-muted">Save items you love by clicking the heart icon on products.</p>
          <Link to="/shop">
            <Button title="Browse Products" className="btn-primary" />
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <FaHeartBroken size={60} className="text-muted mb-3" />
          <h5>No items found</h5>
          <p className="text-muted">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="row">
          {filteredItems.map((product) => {
            const discount = product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            const inWishlist = isInWishlist(product._id);
            const isOutOfStock = product.stock <= 0;
            const isSelected = selectedItems.has(product._id);

            return (
              <div key={product._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  {/* Selection Checkbox */}
                  <div className="position-absolute top-0 start-0 m-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isSelected}
                      onChange={() => handleSelectItem(product._id)}
                    />
                  </div>

                  {/* Wishlist Toggle */}
                  <div className="position-absolute top-0 end-0 m-2">
                    <button
                      onClick={() => handleToggleWishlist(product)}
                      className="btn btn-sm btn-outline-danger rounded-circle"
                      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      {inWishlist ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>

                  {/* Product Image */}
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.image ? `${UPLOADS_URL}/${product.image}` : 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </Link>

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge bg-danger">-{discount}%</span>
                    </div>
                  )}

                  {/* Out of Stock Overlay */}
                  {isOutOfStock && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75">
                      <span className="text-white fw-bold">Out of Stock</span>
                    </div>
                  )}

                  <div className="card-body d-flex flex-column">
                    {/* Product Info */}
                    <Link to={`/product/${product._id}`} className="text-decoration-none">
                      <h5 className="card-title text-dark">{product.name}</h5>
                    </Link>

                    {product.brand && (
                      <p className="text-muted small mb-2">{product.brand}</p>
                    )}

                    {/* Price */}
                    <div className="mb-3">
                      <span className="fs-5 fw-bold text-primary">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-muted text-decoration-line-through ms-2">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <p className={`mb-3 ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                      {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                    </p>

                    {/* Actions */}
                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm flex-grow-1"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        <FaShoppingCart className="me-1" />
                        Add to Cart
                      </button>
                      {product.stock <= 0 && (
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => handleNotifyMe(product._id)}
                        >
                          <FaBell className="me-1" />
                          Notify
                        </button>
                      )}
                      <Link to={`/product/${product._id}`} className="btn btn-outline-secondary btn-sm">
                        <FaEye />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
