import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Button from '../components/Button';
import Loading from '../components/Loading';
import FakePaymentModal from '../components/FakePaymentModal';

const Checkout = () => {
  const { 
    cartItems, 
    subtotal, 
    shipping, 
    tax, 
    discount, 
    finalTotal, 
    appliedCoupon,
    applyCoupon,
    clearCoupon,
    clearCart 
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phone || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

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

  const placeOrder = async (orderPayload) => {
    try {
      setLoading(true);
      const { data } = await API.post('/orders', orderPayload);
      clearCart();
      setPendingOrder(null);
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice: subtotal,
      shippingPrice: shipping,
      taxPrice: tax,
      discountAmount: discount,
      couponCode: appliedCoupon?.code || null,
      totalPrice: finalTotal,
    };

    if (paymentMethod === 'COD') {
      await placeOrder(orderData);
      return;
    }

    setPendingOrder(orderData);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setShowPaymentModal(false);
    if (!pendingOrder) return;
    await placeOrder({
      ...pendingOrder,
      paymentResult,
    });
  };

  const handlePaymentModalClose = () => {
    if (!loading) {
      setShowPaymentModal(false);
    }
  };

  if (loading) return <Loading message="Placing your order..." />;

  if (cartItems.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h4>Your cart is empty</h4>
        <Button title="Continue Shopping" onClick={() => navigate('/shop')} />
      </div>
    );
  }

  const modalAmount = pendingOrder?.totalPrice || finalTotal;
  const modalMethod = pendingOrder?.paymentMethod || paymentMethod;

  return (
    <>
    <div className="container my-5">
      <h2 className="mb-4">Checkout</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            {/* Shipping Address */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Shipping Address</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows="2"
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      className="form-control"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Payment Method</h5>
              </div>
              <div className="card-body">
                <div className="form-check mb-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    className="form-check-input"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="cod" className="form-check-label">
                    Cash on Delivery (COD)
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="card"
                    className="form-check-input"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="card" className="form-check-label">
                    Credit/Debit Card
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="upi"
                    className="form-check-input"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="upi" className="form-check-label">
                    UPI Payment
                  </label>
                </div>
              </div>
            </div>

            <Button type="submit" title="Place Order" className="w-100 py-3" disabled={loading} />
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {/* Cart Items */}
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {cartItems.map((item) => (
                  <div key={item._id} className="d-flex justify-content-between mb-2 small">
                    <span className="text-truncate" style={{ maxWidth: '180px' }}>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="fw-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <hr />

              {/* Coupon Section */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Have a Coupon?</label>
                {appliedCoupon ? (
                  <div className="d-flex align-items-center justify-content-between bg-success bg-opacity-10 p-2 rounded">
                    <span className="badge bg-success">{appliedCoupon.code} applied</span>
                    <button className="btn btn-sm btn-link text-danger p-0" onClick={handleRemoveCoupon}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <small className="text-danger">{couponError}</small>}
              </div>

              <hr />

              {/* Price Breakdown */}
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-success' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
              </div>

              {subtotal < 500 && (
                <small className="text-muted d-block mt-2">
                  Add ₹{(500 - subtotal).toFixed(0)} more for free shipping!
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <FakePaymentModal
      open={showPaymentModal}
      amount={modalAmount}
      method={modalMethod}
      onClose={handlePaymentModalClose}
      onSuccess={handlePaymentSuccess}
    />
    </>
  );
};

export default Checkout;
