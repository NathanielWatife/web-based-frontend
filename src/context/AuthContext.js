import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.verifyToken(token)
        .then(response => {
          const u = response.data?.data?.user || response.data?.user;
          setUser(u || null);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (matricNo, password) => {
    try {
      setError('');
  const response = await authService.login(matricNo, password);
  const token = response.data?.data?.token;
  // Persist token then verify token to get canonical user object (includes isVerified)
  localStorage.setItem('token', token);
  try {
    const verifyResp = await authService.verifyToken(token);
    const canonicalUser = verifyResp.data?.data?.user || verifyResp.data?.user;
    setUser(canonicalUser || null);
  } catch (vErr) {
    // If verify fails, still set basic user returned from login if available
    const user = response.data?.data?.user;
    setUser(user || null);
  }
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      setError('');
  const response = await authService.adminLogin(email, password);
  const token = response.data?.data?.token;
  localStorage.setItem('token', token);
  try {
    const verifyResp = await authService.verifyToken(token);
    const canonicalUser = verifyResp.data?.data?.user || verifyResp.data?.user;
    setUser(canonicalUser || null);
  } catch (vErr) {
    const user = response.data?.data?.user;
    setUser(user || null);
  }
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Admin login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await authService.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Authenticate using a token (used after email verification)
  const authenticateWithToken = async (token) => {
    try {
      localStorage.setItem('token', token);
      const verifyResp = await authService.verifyToken(token);
      const canonicalUser = verifyResp.data?.data?.user || verifyResp.data?.user;
      setUser(canonicalUser || null);
      return { success: true };
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    adminLogin,
    register,
    authenticateWithToken,
    logout,
    setError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};