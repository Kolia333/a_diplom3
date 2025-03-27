import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Room, User, Booking, SpaService } from './entities';
import roomRoutes from './routes/roomRoutes';
import userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';
import spaRoutes from './routes/spaRoutes';
import path from 'path';
import bcrypt from 'bcryptjs';
import { AppDataSource, initializeDatabase } from './database/database';

// Завантаження змінних середовища
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ініціалізація бази даних
initializeDatabase().then(async () => {
  console.log('Connected to SQLite database');

  // Перевірка, чи є дані в базі
  const roomRepository = AppDataSource.getRepository(Room);
  const spaRepository = AppDataSource.getRepository(SpaService);
  const userRepository = AppDataSource.getRepository(User);
  const bookingRepository = AppDataSource.getRepository(Booking);

  const roomCount = await roomRepository.count();
  const spaCount = await spaRepository.count();
  const bookingCount = await bookingRepository.count();

  // Перевірка, чи існує адміністратор
  const adminExists = await userRepository.findOne({ where: { email: 'admin@marialux.com' } });
  
  if (!adminExists) {
    console.log('Створення адміністратора...');
    
    // Хешування пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Створення адміністратора
    const admin = userRepository.create({
      firstName: 'Адміністратор',
      lastName: 'Системи',
      email: 'admin@marialux.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await userRepository.save(admin);
    console.log('Адміністратор створений успішно');
  } else {
    console.log('Адміністратор вже існує');
  }

  // Якщо даних немає, заповнюємо тестовими даними
  if (roomCount === 0 && spaCount === 0) {
    console.log('Заповнення бази даних тестовими даними...');
    
    // Додавання тестових номерів
    const rooms = [
      {
        name: 'Стандартний номер',
        type: 'standard',
        price: 1200,
        capacity: 2,
        description: 'Комфортний номер з усіма зручностями для двох осіб.',
        amenities: ['Wi-Fi', 'Телевізор', 'Кондиціонер', 'Міні-бар'],
        images: ['room1.jpg', 'room1-2.jpg'],
        isAvailable: true
      },
      {
        name: 'Люкс',
        type: 'suite',
        price: 2500,
        capacity: 2,
        description: 'Розкішний номер з окремою вітальнею та спальнею.',
        amenities: ['Wi-Fi', 'Телевізор', 'Кондиціонер', 'Міні-бар', 'Джакузі', 'Балкон'],
        images: ['room2.jpg', 'room2-2.jpg'],
        isAvailable: true
      },
      {
        name: 'Сімейний номер',
        type: 'family',
        price: 1800,
        capacity: 4,
        description: 'Просторий номер для сімейного відпочинку.',
        amenities: ['Wi-Fi', 'Телевізор', 'Кондиціонер', 'Міні-бар', 'Дитяче ліжко'],
        images: ['room3.jpg', 'room3-2.jpg'],
        isAvailable: true
      },
      {
        name: 'Президентський люкс',
        type: 'presidential',
        price: 5000,
        capacity: 2,
        description: 'Найрозкішніший номер в готелі з панорамним видом.',
        amenities: ['Wi-Fi', 'Телевізор', 'Кондиціонер', 'Міні-бар', 'Джакузі', 'Сауна', 'Тераса'],
        images: ['room4.jpg', 'room4-2.jpg'],
        isAvailable: true
      }
    ];
    
    for (const roomData of rooms) {
      const room = roomRepository.create(roomData);
      await roomRepository.save(room);
    }
    
    // Додавання тестових СПА-послуг
    const spaServices = [
      {
        name: 'Класичний масаж',
        description: 'Розслаблюючий масаж всього тіла.',
        price: 800,
        duration: 60,
        available: true
      },
      {
        name: 'Масаж гарячими каменями',
        description: 'Масаж з використанням гарячих каменів для глибокого розслаблення.',
        price: 1200,
        duration: 90,
        available: true
      },
      {
        name: 'Ароматерапія',
        description: 'Масаж з використанням ефірних олій.',
        price: 1000,
        duration: 60,
        available: true
      },
      {
        name: 'Сауна',
        description: 'Відвідування сауни з різними температурними режимами.',
        price: 500,
        duration: 60,
        available: true
      }
    ];
    
    for (const spaData of spaServices) {
      const spa = spaRepository.create(spaData);
      await spaRepository.save(spa);
    }
    
    // Створення тестового користувача
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('user123', salt);
    
    const user = userRepository.create({
      firstName: 'Іван',
      lastName: 'Петренко',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
      phone: '+380991234567',
      address: 'м. Київ, вул. Хрещатик, 1'
    });
    
    await userRepository.save(user);
  } else {
    console.log('База даних вже містить тестові дані');
  }

  // Перевірка наявності бронювань
  if (bookingCount === 0) {
    console.log('Додавання тестового бронювання...');
    
    // Отримуємо перший номер та користувача
    const testRoom = await roomRepository.findOne({ where: { id: 1 } });
    const testUser = await userRepository.findOne({ where: { role: 'user' } });
    
    if (testRoom && testUser) {
      const booking = bookingRepository.create({
        checkIn: new Date('2025-04-01'),
        checkOut: new Date('2025-04-05'),
        totalPrice: 5000,
        status: 'confirmed',
        guestCount: 2,
        specialRequests: 'Прошу підготувати номер до 14:00',
        room: testRoom,
        user: testUser
      });
      
      await bookingRepository.save(booking);
      console.log('Тестове бронювання додано успішно');
    } else {
      console.log('Не вдалося знайти номер або користувача для тестового бронювання');
    }
  } else {
    console.log(`В базі даних вже є ${bookingCount} бронювань`);
  }

  // API маршрути
  app.use('/api/rooms', roomRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/spa', spaRoutes);

  // Обслуговування статичних файлів у продакшн режимі
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
  }
  
  // Обробка помилок
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Щось пішло не так!',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  });

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Database connection error:', error);
});

export default app;
