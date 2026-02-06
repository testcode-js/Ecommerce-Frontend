import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch cart from server when user logs in
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCouponCode('');
      setDiscount(0);
      setAppliedCoupon(null);
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      
      // Transform server cart items to match frontend format
      const items = data.items.map((item) => ({
        _id: item.product?._id || item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        brand: item.brand,
        stock: item.stock,
        quantity: item.quantity,
      }));
      
      setCartItems(items);
      
      if (data.couponCode) {
        setCouponCode(data.couponCode);
        setDiscount(data.discount || 0);
        setAppliedCoupon({ code: data.couponCode, discount: data.discount });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart when authentication changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  // Add item to cart
  const addToCart = async (product, qty = 1) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const { data } = await API.post('/cart/add', {
        productId: product._id,
        quantity: qty,
      });

      const items = data.items.map((item) => ({
        _id: item.product?._id || item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        brand: item.brand,
        stock: item.stock,
        quantity: item.quantity,
      }));

      setCartItems(items);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const { data } = await API.delete(`/cart/remove/${productId}`);

      const items = data.items.map((item) => ({
        _id: item.product?._id || item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        brand: item.brand,
        stock: item.stock,
        quantity: item.quantity,
      }));

      setCartItems(items);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated || quantity < 1) return;

    try {
      const { data } = await API.put('/cart/update', {
        productId,
        quantity,
      });

      const items = data.items.map((item) => ({
        _id: item.product?._id || item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        brand: item.brand,
        stock: item.stock,
        quantity: item.quantity,
      }));

      setCartItems(items);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      clearCoupon();
      return;
    }

    try {
      await API.delete('/cart/clear');
      setCartItems([]);
      clearCoupon();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Apply coupon
  const applyCoupon = async (code, discountAmount, couponData) => {
    setCouponCode(code);
    setDiscount(discountAmount);
    setAppliedCoupon(couponData);

    if (isAuthenticated) {
      try {
        await API.post('/cart/apply-coupon', { code, discount: discountAmount });
      } catch (error) {
        console.error('Error saving coupon to cart:', error);
      }
    }
  };

  // Clear coupon
  const clearCoupon = async () => {
    setCouponCode('');
    setDiscount(0);
    setAppliedCoupon(null);

    if (isAuthenticated) {
      try {
        await API.delete('/cart/remove-coupon');
      } catch (error) {
        console.error('Error removing coupon from cart:', error);
      }
    }
  };

  // Calculated values
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTotal = subtotal;
  const shipping = subtotal >= 500 ? 0 : (subtotal > 0 ? 49 : 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const finalTotal = Math.round((subtotal + tax + shipping - discount) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        cartTotal,
        shipping,
        tax,
        discount,
        finalTotal,
        couponCode,
        appliedCoupon,
        applyCoupon,
        clearCoupon,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
