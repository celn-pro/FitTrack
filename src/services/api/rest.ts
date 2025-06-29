// REST API service functions
import axios from 'axios';

// Create axios instance with default config
export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // logout();
    }
    return Promise.reject(error);
  }
);

// Common API functions
export const get = (url: string, params?: any) => {
  return apiClient.get(url, { params });
};

export const post = (url: string, data?: any) => {
  return apiClient.post(url, data);
};

export const put = (url: string, data?: any) => {
  return apiClient.put(url, data);
};

export const del = (url: string) => {
  return apiClient.delete(url);
};
