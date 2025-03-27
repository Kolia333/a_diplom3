import api from './api';
import cacheService from './cacheService';
import { mockRooms } from '../mockData';

interface Room {
  _id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  description: string;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
}

export const roomService = {
  // Отримати всі номери
  getAllRooms: async (): Promise<Room[]> => {
    // Перевіряємо, чи є дані в кеші
    const cachedRooms = cacheService.get<Room[]>('allRooms');
    if (cachedRooms) {
      return cachedRooms;
    }
    
    try {
      // Якщо даних немає в кеші, робимо запит до API
      const response = await api.get('/rooms');
      
      // Зберігаємо результат в кеш на 10 хвилин
      cacheService.set('allRooms', response.data, 10 * 60 * 1000);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      // Якщо не вдалося отримати дані з API, використовуємо тестові дані
      console.log('Using mock data for rooms');
      return mockRooms;
    }
  },
  
  // Отримати номер за ID
  getRoomById: async (id: string): Promise<Room> => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room by ID:', error);
      throw error;
    }
  },
  
  // Перевірити доступність номера
  checkAvailability: async (id: string, checkIn: string, checkOut: string) => {
    try {
      const response = await api.get(`/rooms/check-availability/${id}`, {
        params: { checkIn, checkOut }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking room availability:', error);
      throw error;
    }
  },
  
  // Створити новий номер (тільки для адміністраторів)
  createRoom: async (roomData: Omit<Room, '_id'>) => {
    try {
      const response = await api.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },
  
  // Оновити номер (тільки для адміністраторів)
  updateRoom: async (id: string, roomData: Partial<Room>) => {
    try {
      const response = await api.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },
  
  // Видалити номер (тільки для адміністраторів)
  deleteRoom: async (id: string) => {
    try {
      const response = await api.delete(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
};

export default roomService;
