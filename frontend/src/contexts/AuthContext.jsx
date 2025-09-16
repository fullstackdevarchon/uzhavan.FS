import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../utils/axiosInstance';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token') || Cookies.get('token');
        
        if (token) {
          // Verify token with backend
          const { data } = await axios.get('/auth/me');
          if (data.user) {
            setUser(data.user);
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    const cookieOptions = {
      path: '/',
      expires: 1, // 1 day
      sameSite: 'Strict',
      secure: window.location.protocol === 'https:'
    };
    
    Cookies.set('token', token, cookieOptions);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    Cookies.remove('token');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login/buyer" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
