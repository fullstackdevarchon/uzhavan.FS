import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh and errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        const { token } = response.data;
        
        // Update token in storage
        localStorage.setItem('token', token);
        Cookies.set('token', token, { path: '/', expires: 1, sameSite: 'Strict' });
        
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        Cookies.remove('role');
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
