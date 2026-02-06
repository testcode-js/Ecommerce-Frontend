import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.get('/wishlist');
      setWishlistItems(data.products || []);
    } catch (error) {
      console.error('Fetch wishlist error:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    try {
      const { data } = await API.post('/wishlist', { productId });
      setWishlistItems(data.wishlist.products || []);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await API.delete(`/wishlist/${productId}`);
      setWishlistItems(data.wishlist.products || []);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to remove from wishlist' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
