import api from './api';
import cacheService from './cacheService';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export const userService = {
  // Отримати всіх користувачів (тільки для адміністраторів)
  getAllUsers: async (): Promise<User[]> => {
    // Очищаємо кеш при кожному запиті, щоб завжди отримувати актуальні дані
    cacheService.remove('allUsers');
    
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },
  
  // Отримати користувача за ID (тільки для адміністраторів)
  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Оновити дані користувача (тільки для адміністраторів або самого користувача)
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Видалити користувача (тільки для адміністраторів)
  deleteUser: async (id: number): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }
};

export default userService;
