// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userData = JSON.parse(localStorage.getItem('user') || 'null');

      if (!token || !role || !userData) {
        clearAuth();
        return false;
      }

      // Validate user data consistency
      if (userData.role !== role) {
        clearAuth();
        return false;
      }

      setUser(userData);
      setIsAuthenticated(true);
      return true;

    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuth();
      return false;
    }
  };

  const clearAuth = () => {
    localStorage.clear();
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login/buyer');
  };

  return { isAuthenticated, user, checkAuth, clearAuth };
};
