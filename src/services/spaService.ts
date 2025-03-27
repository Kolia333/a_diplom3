import api from './api';
import cacheService from './cacheService';
import { mockSpaServices } from '../mockData';

interface SpaService {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

interface BookSpaData {
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

export const spaService = {
  // Отримати всі СПА послуги
  getAllServices: async (): Promise<SpaService[]> => {
    // Перевіряємо, чи є дані в кеші
    const cachedServices = cacheService.get<SpaService[]>('allSpaServices');
    if (cachedServices) {
      return cachedServices;
    }
    
    try {
      // Якщо даних немає в кеші, робимо запит до API
      const response = await api.get('/spa');
      
      // Зберігаємо результат в кеш на 10 хвилин
      cacheService.set('allSpaServices', response.data, 10 * 60 * 1000);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching spa services:', error);
      // Якщо не вдалося отримати дані з API, використовуємо тестові дані
      console.log('Using mock data for spa services');
      return mockSpaServices;
    }
  },
  
  // Отримати СПА послугу за ID
  getServiceById: async (id: string): Promise<SpaService> => {
    try {
      const response = await api.get(`/spa/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching spa service by id:', error);
      throw error;
    }
  },
  
  // Отримати СПА послуги за категорією
  getServicesByCategory: async (category: string): Promise<SpaService[]> => {
    try {
      const response = await api.get(`/spa/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching spa services by category:', error);
      throw error;
    }
  },
  
  // Забронювати СПА послугу
  bookService: async (bookingData: BookSpaData) => {
    try {
      const response = await api.post('/spa/book', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error booking spa service:', error);
      throw error;
    }
  },
  
  // Створити нову СПА послугу (тільки для адміністраторів)
  createService: async (serviceData: Omit<SpaService, '_id'>) => {
    try {
      const response = await api.post('/spa', serviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating spa service:', error);
      throw error;
    }
  },
  
  // Оновити СПА послугу (тільки для адміністраторів)
  updateService: async (id: string, serviceData: Partial<SpaService>) => {
    try {
      const response = await api.put(`/spa/${id}`, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error updating spa service:', error);
      throw error;
    }
  },
  
  // Видалити СПА послугу (тільки для адміністраторів)
  deleteService: async (id: string) => {
    try {
      const response = await api.delete(`/spa/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting spa service:', error);
      throw error;
    }
  }
};

export default spaService;
