import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Базова URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5004/api';

// Створення екземпляру axios з базовими налаштуваннями
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додавання перехоплювача для додавання токена аутентифікації до запитів
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    console.log('API Request to:', config.url);
    console.log('Token from localStorage:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', `Bearer ${token}`);
    } else {
      console.log('No token found in localStorage');
    }
    
    console.log('Request headers:', config.headers);
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Додавання перехоплювача для обробки помилок відповіді
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response from:', response.config.url);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error);
    console.error('Error response:', error.response);
    
    // Обробка помилки 401 (неавторизований)
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized error (401), redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
