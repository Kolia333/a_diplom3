import api from './api';
import cacheService from './cacheService';

interface Booking {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  room: {
    id: number;
    name: string;
    type: string;
    price: number;
    images?: string[];
  };
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
}

interface CreateBookingData {
  roomId: number;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  specialRequests?: string;
}

// Інтерфейс для даних форми бронювання
interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomId: number;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  specialRequests: string;
}

export const bookingService = {
  // Отримати всі бронювання користувача
  getUserBookings: async (): Promise<Booking[]> => {
    // Очищаємо кеш при кожному запиті, щоб завжди отримувати актуальні дані
    cacheService.remove('userBookings');
    
    try {
      // Робимо запит до API
      const response = await api.get('/bookings/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      // Повертаємо порожній масив замість тестових даних
      return [];
    }
  },
  
  // Створити нове бронювання
  createBooking: async (bookingData: CreateBookingData): Promise<Booking> => {
    try {
      const response = await api.post('/bookings', bookingData);
      // Очищаємо кеш після створення нового бронювання
      cacheService.remove('userBookings');
      cacheService.remove('allBookings');
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  // Метод для бронювання номера з форми
  bookRoom: async (formData: BookingFormData): Promise<Booking> => {
    try {
      console.log('Відправляємо дані бронювання на сервер:', formData);
      
      // Перевірка на наявність дат
      if (!formData.checkIn || !formData.checkOut) {
        throw new Error('Дати заїзду та виїзду обов\'язкові');
      }
      
      // Перетворюємо дані форми у формат для API
      const bookingData = {
        roomId: formData.roomId,
        checkIn: formData.checkIn.toISOString().split('T')[0],
        checkOut: formData.checkOut.toISOString().split('T')[0],
        guestCount: formData.adults + formData.children,
        specialRequests: formData.specialRequests || '',
        // Додаємо дані користувача
        userInfo: {
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          email: formData.email || '',
          phone: formData.phone || ''
        }
      };
      
      console.log('Підготовлені дані для відправки:', bookingData);
      
      // Використовуємо XMLHttpRequest для відправки запиту
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5004/api/bookings', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Бронювання успішно створено:', xhr.responseText);
            // Очищаємо кеш після створення нового бронювання
            cacheService.remove('userBookings');
            cacheService.remove('allBookings');
            resolve(JSON.parse(xhr.responseText));
          } else {
            console.error('Помилка від сервера:', xhr.responseText);
            reject(new Error(xhr.responseText || 'Помилка при створенні бронювання'));
          }
        };
        
        xhr.onerror = function() {
          console.error('Помилка мережі при створенні бронювання');
          reject(new Error('Помилка мережі при створенні бронювання'));
        };
        
        xhr.send(JSON.stringify(bookingData));
      });
    } catch (error: any) {
      console.error('Помилка при створенні бронювання:', error);
      throw new Error(error.message || 'Помилка при створенні бронювання');
    }
  },
  
  // Скасувати бронювання
  cancelBooking: async (id: number): Promise<Booking> => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      // Очищаємо кеш після скасування бронювання
      cacheService.remove('userBookings');
      cacheService.remove('allBookings');
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },
  
  // Отримати всі бронювання (тільки для адміністраторів)
  getAllBookings: async (): Promise<Booking[]> => {
    // Перевіряємо, чи є дані в кеші
    const cachedBookings = cacheService.get<Booking[]>('allBookings');
    if (cachedBookings) {
      console.log('Returning cached bookings:', cachedBookings);
      return cachedBookings;
    }
    
    try {
      console.log('Sending request to /bookings endpoint');
      console.log('API URL:', api.defaults.baseURL);
      
      const response = await api.get('/bookings');
      console.log('Response from /bookings endpoint:', response.data);
      
      // Зберігаємо результат в кеш на 5 хвилин
      cacheService.set('allBookings', response.data, 5 * 60 * 1000);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      
      // Повертаємо порожній масив, оскільки в адмін-панелі краще показати
      // "Немає бронювань для відображення", ніж показувати фейкові дані
      return [];
    }
  },
  
  // Оновити статус бронювання (тільки для адміністраторів)
  updateBookingStatus: async (id: number, status: string): Promise<Booking> => {
    try {
      const response = await api.put(`/bookings/${id}/status`, { status });
      // Очищаємо кеш після оновлення статусу бронювання
      cacheService.remove('userBookings');
      cacheService.remove('allBookings');
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
  
  // Видалити бронювання (тільки для адміністраторів)
  deleteBooking: async (id: number): Promise<void> => {
    try {
      await api.delete(`/bookings/${id}`);
      // Очищаємо кеш після видалення бронювання
      cacheService.remove('userBookings');
      cacheService.remove('allBookings');
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },
  
  // Очистити кеш бронювань
  clearBookingsCache: (): void => {
    console.log('Clearing bookings cache');
    cacheService.remove('userBookings');
    cacheService.remove('allBookings');
  }
};

export default bookingService;
