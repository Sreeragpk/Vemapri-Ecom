// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       loadUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const loadUser = async () => {
//     try {
//       const res = await axios.get('/api/users/profile');
//       setUser(res.data);
//     } catch (error) {
//       localStorage.removeItem('token');
//       delete axios.defaults.headers.common['Authorization'];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = (token, userData) => {
//     localStorage.setItem('token', token);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     loadUser
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

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

  // Load user on first mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // api interceptor will add Authorization header
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/users/profile');
      // adjust if your backend wraps user differently
      setUser(res.data);
    } catch (error) {
      const status = error?.response?.status;
      // Only clear token if backend explicitly says unauthorized
      if (status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      } else {
        console.error('loadUser error (token kept):', error);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Call this from your Login / Register page
   * e.g. login(res.data.token, res.data.user)
   */
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    // no need to manually update axios headers:
    // api interceptor reads token from localStorage on each request
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
