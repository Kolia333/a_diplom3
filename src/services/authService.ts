import api from './api';
import { mockUsers } from '../mockData';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const authService = {
  // Реєстрація нового користувача
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('authService.register: Registering new user:', userData.email);
      const response = await api.post<AuthResponse>('/users/register', userData);
      
      console.log('authService.register: Registration successful, received data:', response.data);
      
      // Збереження токена та інформації про користувача в localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('authService.register: Token and user data saved to localStorage');
      
      return response.data;
    } catch (error) {
      console.error('authService.register: Error registering user:', error);
      throw error;
    }
  },
  
  // Вхід користувача
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      console.log('authService.login: Logging in user:', credentials.email);
      const response = await api.post<AuthResponse>('/users/login', credentials);
      
      console.log('authService.login: Login successful, received data:', response.data);
      
      // Збереження токена та інформації про користувача в localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('authService.login: Token and user data saved to localStorage');
      
      return response.data;
    } catch (error) {
      console.error('authService.login: Error logging in:', error);
      
      // Для тестування: якщо API недоступний, дозволяємо вхід з тестовими даними
      if (credentials.email === 'admin@marialux.com' && credentials.password === 'admin123') {
        console.log('authService.login: Using mock data for admin login');
        
        // Створюємо справжній JWT токен для адміністратора
        try {
          console.log('Trying to get real token from API even though previous request failed');
          // Спробуємо ще раз, але з іншим URL
          const response = await api.post<AuthResponse>('/users/login', credentials, {
            baseURL: 'http://localhost:5004/api' // Явно вказуємо базовий URL
          });
          
          console.log('Second attempt successful, using real token');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return response.data;
        } catch (secondError) {
          console.error('Second attempt also failed:', secondError);
          
          // Якщо і друга спроба не вдалася, використовуємо тестові дані
          const mockResponse: AuthResponse = {
            token: 'mock-jwt-token-for-admin',
            user: {
              id: 1,
              firstName: 'Адміністратор',
              lastName: 'Системи',
              email: 'admin@marialux.com',
              role: 'admin'
            }
          };
          
          localStorage.setItem('token', mockResponse.token);
          localStorage.setItem('user', JSON.stringify(mockResponse.user));
          
          console.log('authService.login: Mock token and user data saved to localStorage');
          
          return mockResponse;
        }
      } else if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
        console.log('authService.login: Using mock data for user login');
        const mockResponse: AuthResponse = {
          token: 'mock-jwt-token-for-user',
          user: {
            id: 2,
            firstName: 'Іван',
            lastName: 'Петренко',
            email: 'user@example.com',
            role: 'user'
          }
        };
        
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        console.log('authService.login: Mock token and user data saved to localStorage');
        
        return mockResponse;
      }
      
      throw error;
    }
  },
  
  // Вихід користувача
  logout: () => {
    console.log('authService.logout: Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('authService.logout: Token and user data removed from localStorage');
  },
  
  // Отримання профілю користувача
  getProfile: async () => {
    try {
      console.log('authService.getProfile: Fetching user profile');
      const response = await api.get('/users/profile');
      console.log('authService.getProfile: Profile fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('authService.getProfile: Error fetching user profile:', error);
      
      // Для тестування: якщо API недоступний, повертаємо дані з localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          console.log('authService.getProfile: Using cached user data:', userData);
          return userData;
        } catch (e) {
          console.error('authService.getProfile: Error parsing user data:', e);
        }
      }
      
      throw error;
    }
  },
  
  // Оновлення профілю користувача
  updateProfile: async (userData: Partial<RegisterData>) => {
    try {
      console.log('authService.updateProfile: Updating user profile:', userData);
      const response = await api.put('/users/profile', userData);
      
      // Оновлення даних користувача в localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('authService.updateProfile: Updated user data in localStorage:', updatedUser);
      }
      
      console.log('authService.updateProfile: Profile updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('authService.updateProfile: Error updating user profile:', error);
      throw error;
    }
  },
  
  // Зміна пароля
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      console.log('authService.changePassword: Changing password');
      const response = await api.put('/users/change-password', { currentPassword, newPassword });
      console.log('authService.changePassword: Password changed successfully');
      return response.data;
    } catch (error) {
      console.error('authService.changePassword: Error changing password:', error);
      throw error;
    }
  },
  
  // Перевірка, чи користувач авторизований
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const isAuth = token !== null;
    console.log('authService.isAuthenticated:', isAuth, 'token:', token ? 'exists' : 'not found');
    return isAuth;
  },
  
  // Отримання поточного користувача
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    console.log('authService.getCurrentUser: User data from localStorage:', userStr);
    
    if (!userStr) {
      console.log('authService.getCurrentUser: No user data found');
      return null;
    }
    
    try {
      const userData = JSON.parse(userStr);
      console.log('authService.getCurrentUser: Parsed user data:', userData);
      return userData;
    } catch (error) {
      console.error('authService.getCurrentUser: Error parsing user data:', error);
      return null;
    }
  },
  
  // Перевірка, чи користувач є адміністратором
  isAdmin: (): boolean => {
    const userStr = localStorage.getItem('user');
    console.log('authService.isAdmin: User data from localStorage:', userStr);
    
    if (!userStr) {
      console.log('authService.isAdmin: No user data found, returning false');
      return false;
    }
    
    try {
      const user = JSON.parse(userStr);
      const isAdmin = user.role === 'admin';
      console.log('authService.isAdmin: User role:', user.role, 'isAdmin:', isAdmin);
      return isAdmin;
    } catch (error) {
      console.error('authService.isAdmin: Error parsing user data:', error);
      return false;
    }
  }
};

export default authService;
