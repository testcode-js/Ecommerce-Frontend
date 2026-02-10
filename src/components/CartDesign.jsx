import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegTrashCan, FaTag, FaTruck, FaReceipt } from 'react-icons/fa6';
import { FaShoppingCart, FaMinus, FaPlus, FaCheck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const CartDesign = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    subtotal,
    shipping,
    tax,
    discount,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    clearCoupon 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponLoading(true);

    try {
      const { data } = await API.post('/coupons/apply', {
        code: couponCode.trim(),
        cartTotal: subtotal,
      });
      applyCoupon(data.code, data.discount, data);
      setCouponCode('');
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    clearCoupon();
    setCouponError('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="modern-cart">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-icon">
              <FaShoppingCart />
            </div>
            <h1>Your cart is empty</h1>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>

        <style>{`
          .modern-cart {
            padding: 4rem 0;
            min-height: 60vh;
          }

          .empty-cart {
            text-align: center;
            padding: 4rem 2rem;
          }

          .empty-icon {
            font-size: 6rem;
            color: #e9ecef;
            margin-bottom: 2rem;
          }

          .empty-cart h1 {
            font-size: 2rem;
            color: #2d3436;
            margin-bottom: 1rem;
          }

          .empty-cart p {
            color: #636e72;
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }

          .btn {
            padding: 0.8rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
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
        `}</style>
      </div>
    );
  }

  return (
    <div className="modern-cart">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p className="cart-count">{cartItems.length} items</p>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <div className="header-item product">Product</div>
              <div className="header-item price">Price</div>
              <div className="header-item quantity">Quantity</div>
              <div className="header-item total">Total</div>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="item-product">
                    <div className="product-image">
                      <img
                        src={item.image ? `${UPLOADS_URL}/${item.image}` : 'https://via.placeholder.com/80'}
                        alt={item.name}
                      />
                    </div>
                    <div className="product-details">
                      <Link to={`/product/${item._id}`} className="product-name">
                        {item.name}
                      </Link>
                      {item.brand && <span className="product-brand">{item.brand}</span>}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="remove-btn"
                      >
                        <FaRegTrashCan /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="item-price">₹{item.price.toFixed(2)}</div>

                  <div className="item-quantity">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.stock && item.quantity >= item.stock}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-sidebar">
            {/* Coupon Section */}
            <div className="coupon-section">
              <div className="section-title">
                <FaTag />
                <span>Have a Coupon?</span>
              </div>
              {appliedCoupon ? (
                <div className="applied-coupon">
                  <div className="coupon-info">
                    <FaCheck />
                    <span>{appliedCoupon.code} applied</span>
                  </div>
                  <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <div className="coupon-input-group">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <button 
                    className="apply-coupon-btn" 
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && <div className="coupon-error">{couponError}</div>}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="section-title">
                <FaReceipt />
                <span>Order Summary</span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>
                  <FaTruck /> Shipping
                </span>
                <span>{shipping === 0 ? <span className="free-shipping">Free</span> : `₹${shipping.toFixed(2)}`}</span>
              </div>

              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <strong>Total</strong>
                <strong>₹{finalTotal.toFixed(2)}</strong>
              </div>

              {subtotal < 500 && (
                <div className="shipping-notice">
                  Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}

              <div className="checkout-actions">
                <button
                  className="btn btn-primary checkout-btn"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>

                <Link to="/shop" className="btn btn-outline continue-shopping-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modern-cart {
          padding: 2rem 0;
          min-height: 60vh;
        }

        .cart-header {
          margin-bottom: 2rem;
        }

        .cart-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .cart-count {
          color: #636e72;
          font-size: 1.1rem;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
        }

        .cart-items-section {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 1.5rem;
        }

        .cart-items-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 2px solid #f0f0f0;
          font-weight: 600;
          color: #636e72;
          font-size: 0.9rem;
        }

        .cart-items-list {
          margin-top: 1rem;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1.5rem 1rem;
          border-bottom: 1px solid #f8f9fa;
          align-items: center;
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          background: #f8f9fa;
          border-radius: 8px;
        }

        .item-product {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .product-image img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 12px;
        }

        .product-details {
          flex: 1;
        }

        .product-name {
          font-weight: 600;
          color: #2d3436;
          text-decoration: none;
          display: block;
          margin-bottom: 0.3rem;
          transition: color 0.3s ease;
        }

        .product-name:hover {
          color: #667eea;
        }

        .product-brand {
          color: #636e72;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ff4757;
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          color: #ff3838;
        }

        .item-price, .item-total {
          font-weight: 600;
          color: #2d3436;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 0.3rem;
        }

        .quantity-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #667eea;
          color: #fff;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-value {
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }

        .cart-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .coupon-section, .order-summary {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 1.5rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #2d3436;
          margin-bottom: 1rem;
        }

        .coupon-input-group {
          display: flex;
          gap: 0.5rem;
        }

        .coupon-input {
          flex: 1;
          padding: 0.8rem;
          border: 2px solid #f0f0f0;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .coupon-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .apply-coupon-btn {
          padding: 0.8rem 1.2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .apply-coupon-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(102,126,234,0.3);
        }

        .applied-coupon {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem;
          background: #d4edda;
          border-radius: 8px;
          border: 1px solid #c3e6cb;
        }

        .coupon-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #155724;
          font-weight: 600;
        }

        .remove-coupon-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .coupon-error {
          color: #dc3545;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          color: #636e72;
        }

        .summary-row.discount {
          color: #00b894;
        }

        .summary-row.total {
          font-size: 1.2rem;
          color: #2d3436;
        }

        .summary-divider {
          height: 1px;
          background: #f0f0f0;
          margin: 1rem 0;
        }

        .free-shipping {
          color: #00b894;
          font-weight: 600;
        }

        .shipping-notice {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .checkout-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn {
          padding: 1rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102,126,234,0.4);
        }

        .btn-outline {
          background: #fff;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-outline:hover {
          background: #667eea;
          color: #fff;
        }

        @media (max-width: 1024px) {
          .cart-content {
            grid-template-columns: 1fr 350px;
          }
        }

        @media (max-width: 768px) {
          .modern-cart {
            padding: 1rem 0;
          }

          .cart-header h1 {
            font-size: 2rem;
          }

          .cart-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .cart-items-header {
            display: none;
          }

          .cart-item {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
          }

          .item-product {
            flex-direction: column;
            text-align: center;
          }

          .item-price, .item-quantity, .item-total {
            text-align: center;
          }

          .quantity-controls {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default CartDesign;
