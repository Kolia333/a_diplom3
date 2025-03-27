import express from 'express';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../database/database';
import { Booking } from '../entities/Booking';
import { Room } from '../entities/Room';
import { User } from '../entities/User';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Отримуємо репозиторії для роботи з базою даних
const bookingRepository = AppDataSource.getRepository(Booking);
const roomRepository = AppDataSource.getRepository(Room);
const userRepository = AppDataSource.getRepository(User);

// Отримати всі бронювання 
router.get('/', async (req, res) => {
  try {
    console.log('Запит на отримання всіх бронювань');
    
    const bookings = await bookingRepository.find({
      relations: ['user', 'room']
    });
    
    console.log('Знайдено бронювань:', bookings.length);
    
    // Трансформуємо дані для відповідності формату клієнтської частини
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      user: {
        id: booking.user.id,
        firstName: booking.user.firstName,
        lastName: booking.user.lastName,
        email: booking.user.email
      },
      room: {
        id: booking.room.id,
        name: booking.room.name,
        type: booking.room.type,
        price: booking.room.price,
        images: booking.room.images || []
      },
      checkIn: booking.checkIn.toISOString().split('T')[0],
      checkOut: booking.checkOut.toISOString().split('T')[0],
      guestCount: booking.guestCount,
      totalPrice: booking.totalPrice,
      status: booking.status,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt.toISOString()
    }));
    
    console.log('Трансформовані бронювання:', JSON.stringify(transformedBookings, null, 2));
    
    res.status(200).json(transformedBookings);
  } catch (error) {
    console.error('Помилка при отриманні бронювань:', error);
    res.status(500).json({ message: 'Помилка при отриманні бронювань', error });
  }
});

// Отримати бронювання користувача
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookings = await bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['room']
    });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні бронювань користувача', error });
  }
});

// Отримати останні бронювання (для панелі адміністратора)
router.get('/recent', async (req, res) => {
  try {
    console.log('Запит на отримання останніх бронювань для панелі адміністратора');
    
    // Спочатку перевіримо загальну кількість бронювань в базі даних
    const count = await bookingRepository.count();
    console.log('Загальна кількість бронювань в базі даних:', count);
    
    // Отримуємо тільки ідентифікатори бронювань (без relations) для тестування
    const bookingIds = await bookingRepository
      .createQueryBuilder('booking')
      .select('booking.id')
      .orderBy('booking.createdAt', 'DESC')
      .limit(5)
      .getRawMany();
    
    console.log('Знайдені ID бронювань:', bookingIds);
    
    if (bookingIds.length === 0) {
      console.log('Бронювань не знайдено');
      return res.status(200).json([]);
    }
    
    // Тепер спробуємо отримати повні дані для кожного бронювання окремо
    const bookingsPromises = bookingIds.map(async (row) => {
      try {
        const id = row.booking_id;
        console.log(`Отримання даних для бронювання ID: ${id}`);
        
        const booking = await bookingRepository.findOne({
          where: { id },
          relations: ['user', 'room']
        });
        
        if (!booking) {
          console.log(`Бронювання з ID: ${id} не знайдено`);
          return null;
        }
        
        // Функція для безпечного форматування дати (обробляє як Date, так і String)
        const formatDate = (dateValue: any): string => {
          if (!dateValue) return '';
          
          // Якщо це вже рядок, перевіримо, чи це валідна дата
          if (typeof dateValue === 'string') {
            // Перевіряємо, чи це ISO-формат або простий рядок yyyy-mm-dd
            if (dateValue.includes('T') || /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
              return dateValue.split('T')[0]; // повертаємо тільки дату
            }
            return dateValue; // повертаємо як є
          }
          
          // Якщо це об'єкт Date
          if (dateValue instanceof Date) {
            return dateValue.toISOString().split('T')[0];
          }
          
          // В інших випадках просто перетворюємо на рядок
          return String(dateValue);
        };
        
        console.log(`Дані бронювання з ID: ${id}:`, booking);
        return {
          id: booking.id,
          roomId: booking.room?.id,
          userId: booking.user?.id,
          checkIn: formatDate(booking.checkIn),
          checkOut: formatDate(booking.checkOut),
          status: booking.status,
          createdAt: booking.createdAt instanceof Date 
            ? booking.createdAt.toISOString() 
            : String(booking.createdAt),
          user: booking.user ? {
            id: booking.user.id,
            firstName: booking.user.firstName,
            lastName: booking.user.lastName,
            email: booking.user.email
          } : null,
          room: booking.room ? {
            id: booking.room.id,
            name: booking.room.name,
            type: booking.room.type
          } : null
        };
      } catch (err) {
        console.error(`Помилка при отриманні бронювання ID: ${row.booking_id}:`, err);
        return null;
      }
    });
    
    const bookingsWithDetails = await Promise.all(bookingsPromises);
    const validBookings = bookingsWithDetails.filter(booking => booking !== null);
    
    console.log('Трансформовані дійсні бронювання:', JSON.stringify(validBookings, null, 2));
    
    res.status(200).json(validBookings);
  } catch (error) {
    console.error('Помилка при отриманні останніх бронювань:', error);
    console.error('Деталі помилки:', error instanceof Error ? error.stack : String(error));
    // Надіслати порожній масив для уникнення помилок на фронтенді
    res.status(200).json([]);
  }
});

// Отримати бронювання за ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const bookingId = parseInt(id);
    
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Невірний формат ID' });
    }
    
    const booking = await bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['user', 'room']
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронювання не знайдено' });
    }
    
    // Перевірка, чи має користувач доступ до цього бронювання
    if (req.user.role !== 'admin' && booking.user.id !== req.user.id) {
      return res.status(403).json({ message: 'У вас немає доступу до цього бронювання' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні бронювання', error });
  }
});

// Створити нове бронювання
router.post('/', async (req, res) => {
  try {
    console.log('Запит на створення бронювання:', req.body);
    const { roomId, checkIn, checkOut, guestCount, specialRequests, userInfo } = req.body;
    
    // Перевірка наявності обов'язкових полів
    if (!roomId || !checkIn || !checkOut || !guestCount) {
      console.error('Відсутні обов\'язкові поля:', { roomId, checkIn, checkOut, guestCount });
      return res.status(400).json({ message: 'Всі обов\'язкові поля повинні бути заповнені' });
    }
    
    // Перевірка правильності дат
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    console.log('Дати бронювання:', { checkInDate, checkOutDate });
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Дата виїзду повинна бути пізніше дати заїзду' });
    }
    
    // Перевірка, чи існує номер
    const room = await roomRepository.findOne({ where: { id: roomId } });
    
    if (!room) {
      console.error('Номер не знайдено:', roomId);
      return res.status(404).json({ message: 'Номер не знайдено' });
    }
    
    console.log('Знайдено номер:', room);
    
    // Перевірка, чи доступний номер на вказані дати
    const existingBookings = await bookingRepository.find({
      where: {
        room: { id: roomId },
        status: 'підтверджено',
        checkIn: LessThanOrEqual(checkOutDate),
        checkOut: MoreThanOrEqual(checkInDate)
      }
    });
    
    if (existingBookings.length > 0) {
      console.error('Номер недоступний на вказані дати:', existingBookings);
      return res.status(400).json({ message: 'Номер недоступний на вказані дати' });
    }
    
    // Створюємо або знаходимо користувача
    let user;
    
    if (userInfo && userInfo.email) {
      // Шукаємо користувача за email
      user = await userRepository.findOne({ where: { email: userInfo.email } });
      
      if (!user) {
        // Створюємо нового користувача
        const tempPassword = 'temp' + Math.random().toString(36).substring(2, 10);
        
        const newUser = userRepository.create({
          firstName: userInfo.firstName || 'Гість',
          lastName: userInfo.lastName || '',
          email: userInfo.email,
          password: tempPassword,
          phone: userInfo.phone || '',
          role: 'user'
        });
        
        try {
          user = await userRepository.save(newUser);
          console.log('Створено нового користувача:', user);
        } catch (error) {
          console.error('Помилка при створенні користувача:', error);
          // Якщо помилка унікальності, спробуємо знайти користувача ще раз
          user = await userRepository.findOne({ where: { email: userInfo.email } });
          if (!user) {
            return res.status(500).json({ message: 'Помилка при створенні користувача' });
          }
        }
      }
    } else if (req.user) {
      user = await userRepository.findOne({ where: { id: req.user.id } });
    } else {
      // Створюємо тимчасового користувача
      const tempEmail = 'guest' + Date.now() + '@example.com';
      const tempPassword = 'temp' + Math.random().toString(36).substring(2, 10);
      
      const guestUser = userRepository.create({
        firstName: 'Гість',
        lastName: '',
        email: tempEmail,
        password: tempPassword,
        role: 'user'
      });
      
      user = await userRepository.save(guestUser);
    }
    
    if (!user) {
      return res.status(404).json({ message: 'Не вдалося створити або знайти користувача' });
    }
    
    // Розрахунок кількості днів і загальної вартості
    const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * days;
    
    console.log('Розрахунок вартості:', { days, totalPrice });
    
    // Створення нового бронювання
    const newBooking = bookingRepository.create({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestCount,
      specialRequests: specialRequests || '',
      totalPrice,
      status: 'очікує підтвердження',
      room,
      user
    });
    
    const savedBooking = await bookingRepository.save(newBooking);
    console.log('Створено нове бронювання:', savedBooking);
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Загальна помилка при створенні бронювання:', error);
    res.status(500).json({ message: 'Помилка при створенні бронювання', error: String(error) });
  }
});

// Оновити статус бронювання (тільки для адміністраторів)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const bookingId = parseInt(id);
    
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Невірний формат ID' });
    }
    
    // Перевірка наявності статусу
    if (!status) {
      return res.status(400).json({ message: 'Статус є обов\'язковим полем' });
    }
    
    // Перевірка валідності статусу
    const validStatuses = ['очікує підтвердження', 'підтверджено', 'скасовано', 'завершено'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Невірний статус бронювання' });
    }
    
    // Перевірка, чи існує бронювання
    const booking = await bookingRepository.findOne({ where: { id: bookingId } });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронювання не знайдено' });
    }
    
    // Оновлення статусу
    booking.status = status;
    const updatedBooking = await bookingRepository.save(booking);
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при оновленні статусу бронювання', error });
  }
});

// Скасувати бронювання
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const bookingId = parseInt(id);
    const userId = req.user.id;
    
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Невірний формат ID' });
    }
    
    // Перевірка, чи існує бронювання
    const booking = await bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['user']
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронювання не знайдено' });
    }
    
    // Перевірка, чи має користувач доступ до цього бронювання
    if (req.user.role !== 'admin' && booking.user.id !== userId) {
      return res.status(403).json({ message: 'У вас немає доступу до цього бронювання' });
    }
    
    // Перевірка, чи можна скасувати бронювання
    if (booking.status === 'скасовано' || booking.status === 'завершено') {
      return res.status(400).json({ message: 'Неможливо скасувати бронювання з поточним статусом' });
    }
    
    // Оновлення статусу
    booking.status = 'скасовано';
    const updatedBooking = await bookingRepository.save(booking);
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при скасуванні бронювання', error });
  }
});

// Видалити бронювання (тільки для адміністраторів)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const bookingId = parseInt(id);
    
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Невірний формат ID' });
    }
    
    // Перевірка, чи існує бронювання
    const booking = await bookingRepository.findOne({ where: { id: bookingId } });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронювання не знайдено' });
    }
    
    // Видалення бронювання
    await bookingRepository.remove(booking);
    
    res.status(200).json({ message: 'Бронювання успішно видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при видаленні бронювання', error });
  }
});

// Тестовий ендпоінт для перевірки авторизації
router.get('/test', authMiddleware, (req, res) => {
  console.log('Test endpoint called');
  console.log('User:', req.user);
  res.status(200).json({ message: 'Авторизація працює', user: req.user });
});

export default router;
