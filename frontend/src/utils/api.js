import axios from './axiosInstance';
import { toast } from 'react-toastify';

export const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', {
      url,
      method,
      error: error.response?.data || error.message,
    });

    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Show error toast for non-401 errors
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
    
    // For 401, the interceptor will handle the redirect
    throw error;
  }
};

// Helper methods for common HTTP methods
export const get = (url, config) => apiRequest('get', url, null, config);
export const post = (url, data, config) => apiRequest('post', url, data, config);
export const put = (url, data, config) => apiRequest('put', url, data, config);
export const del = (url, config) => apiRequest('delete', url, null, config);
