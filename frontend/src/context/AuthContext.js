import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('grocery_user');
    const token = localStorage.getItem('grocery_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('grocery_token', token);
    localStorage.setItem('grocery_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone });
    const { token, user: userData } = res.data;
    localStorage.setItem('grocery_token', token);
    localStorage.setItem('grocery_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('grocery_token');
    localStorage.removeItem('grocery_user');
    setUser(null);
    toast.info('Logged out successfully');
  };

  const updateUserData = (userData) => {
    const updated = { ...user, ...userData };
    localStorage.setItem('grocery_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserData, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
