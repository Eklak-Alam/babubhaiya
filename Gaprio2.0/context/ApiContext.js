"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

// Create a configured axios instance for API calls
const API = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      delete API.defaults.headers.common['Authorization'];
      // Don't redirect here to avoid conflicts with component logic
    }
    return Promise.reject(error);
  }
);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      API.get('/users/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Profile fetch error:', error);
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;
    
    Cookies.set('token', token, { 
      expires: 30,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    return userData;
  };

  const register = async (name, username, email, password) => {
    const response = await API.post('/auth/register', { 
      name, 
      username, 
      email, 
      password 
    });
    return response.data;
  };
  
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    delete API.defaults.headers.common['Authorization'];
    router.push('/chat/login');
  };

  const value = {
    user,
    login,
    logout,
    register,
    API,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, API };