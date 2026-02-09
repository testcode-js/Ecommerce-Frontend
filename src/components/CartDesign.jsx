import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegTrashCan } from 'react-icons/fa6';
import { FaMinus, FaPlus } from 'react-icons/fa';
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
      <section className="cart-section" style={{ margin: '100px 0' }}>
        <div className="container text-center">
          <h3>Your cart is empty</h3>
          <p className="text-muted mt-3">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="btn btn-primary mt-3">Continue Shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-section" style={{ margin: '60px 0' }}>
      <div className="container">
        <h3 className="mb-4">Shopping Cart ({cartItems.length} items)</h3>
        <div className="row">
          <div className="col-lg-8">
            <div className="cart-items">
              <div className="cart-header mb-3 d-none d-lg-block">
                <div className="row">
                  <div className="col-lg-6"><h6>Product</h6></div>
                  <div className="col-lg-2"><h6>Price</h6></div>
                  <div className="col-lg-2"><h6>Quantity</h6></div>
                  <div className="col-lg-2"><h6>Total</h6></div>
                </div>
              </div>

              {cartItems.map((item) => (
                <div className="cart-item mb-3 p-3 border rounded" key={item._id}>
                  <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.image ? `${UPLOADS_URL}/${item.image}` : 'https://via.placeholder.com/80'}
                          alt={item.name}
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>
                          <Link to={`/product/${item._id}`} className="text-decoration-none">
                            <h6 className="mb-1">{item.name}</h6>
                          </Link>
                          {item.brand && <small className="text-muted">Brand: {item.brand}</small>}
                          <div className="mt-1">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="btn btn-link p-0 text-danger small"
                            >
                              <FaRegTrashCan /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <span className="fw-bold">₹{item.price.toFixed(2)}</span>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.stock && item.quantity >= item.stock}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <span className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            {/* Coupon Section */}
            <div className="card mb-3">
              <div className="card-body">
                <h6 className="card-title">Have a Coupon?</h6>
                {appliedCoupon ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="badge bg-success fs-6">{appliedCoupon.code} applied</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={handleRemoveCoupon}>Remove</button>
                  </div>
                ) : (
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <small className="text-danger mt-1 d-block">{couponError}</small>}
              </div>
            </div>

            {/* Order Summary */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-success">Free</span> : `₹${shipping.toFixed(2)}`}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <hr />

                <div className="d-flex justify-content-between mb-3">
                  <strong className="fs-5">Total</strong>
                  <strong className="fs-5">₹{finalTotal.toFixed(2)}</strong>
                </div>

                {subtotal < 500 && (
                  <small className="text-muted d-block mb-2">
                    Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                  </small>
                )}

                <button
                  className="btn btn-primary w-100"
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

                <Link to="/shop" className="btn btn-outline-secondary w-100 mt-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartDesign;
