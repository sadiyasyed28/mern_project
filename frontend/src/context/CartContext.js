import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const res = await cartAPI.get();
      setCart(res.data.cart);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return false;
    }
    try {
      const res = await cartAPI.add(productId, quantity);
      setCart(res.data.cart);
      toast.success('Item added to cart! 🛒');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await cartAPI.update(productId, quantity);
      setCart(res.data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartAPI.remove(productId);
      setCart(res.data.cart);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], totalAmount: 0 });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const isInCart = (productId) => {
    return cart.items?.some(item =>
      (item.product?._id || item.product) === productId
    ) || false;
  };

  const getItemQuantity = (productId) => {
    const item = cart.items?.find(i =>
      (i.product?._id || i.product) === productId
    );
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartLoading,
      cartCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart,
      isInCart,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};
