import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token') || Cookies.get('token');
  
  // If no token, redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ 
          from: location,
          message: 'Please log in to access this page' 
        }}
        replace
      />
    );
  }
  
  // If no user data but token exists, clear invalid auth data
  if (!user) {
    localStorage.removeItem('token');
    Cookies.remove('token');
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
