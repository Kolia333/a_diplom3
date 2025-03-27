import { AppDataSource } from './database/database';
import { Room, User, SpaService, Booking } from './entities';
import * as bcrypt from 'bcrypt';

export const seedDatabase = async () => {
  try {
    // Перевірка, чи є вже дані в базі
    const roomCount = await AppDataSource.getRepository(Room).count();
    const userCount = await AppDataSource.getRepository(User).count();
    const spaCount = await AppDataSource.getRepository(SpaService).count();

    if (roomCount > 0 && userCount > 0 && spaCount > 0) {
      console.log('База даних вже містить тестові дані');
      return;
    }

    console.log('Заповнення бази даних тестовими даними...');

    // Створення адміністратора
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = AppDataSource.getRepository(User).create({
      firstName: 'Адміністратор',
      lastName: 'Системи',
      email: 'admin@marialux.com',
      password: adminPassword,
      role: 'admin',
      phone: '+380991234567',
      address: 'м. Київ, вул. Хрещатик, 1'
    });
    await AppDataSource.getRepository(User).save(admin);

    // Створення тестового користувача
    const userPassword = await bcrypt.hash('user123', 10);
    const user = AppDataSource.getRepository(User).create({
      firstName: 'Іван',
      lastName: 'Петренко',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      phone: '+380991234568',
      address: 'м. Львів, вул. Франка, 15'
    });
    await AppDataSource.getRepository(User).save(user);

    // Створення номерів
    const rooms = [
      {
        name: 'Стандартний номер',
        type: 'стандарт',
        price: 1200,
        capacity: 2,
        description: 'Комфортний стандартний номер з усіма зручностями для двох осіб.',
        amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Душ'],
        images: [
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
        ],
        isAvailable: true
      },
      {
        name: 'Люкс',
        type: 'люкс',
        price: 2500,
        capacity: 2,
        description: 'Розкішний номер з окремою вітальнею та спальнею, ідеальний для пар.',
        amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Ванна', 'Халати', 'Тапочки', 'Сейф'],
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
        ],
        isAvailable: true
      },
      {
        name: 'Сімейний номер',
        type: 'сімейний',
        price: 3000,
        capacity: 4,
        description: 'Просторий номер для всієї родини з двома спальнями та зручностями для дітей.',
        amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Ванна', 'Дитяче ліжечко', 'Ігрова зона'],
        images: [
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        ],
        isAvailable: true
      },
      {
        name: 'Президентський люкс',
        type: 'президентський',
        price: 5000,
        capacity: 2,
        description: 'Найрозкішніший номер у готелі з панорамними вікнами, джакузі та персональним обслуговуванням.',
        amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Джакузі', 'Сауна', 'Тераса', 'Персональний дворецький'],
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        ],
        isAvailable: true
      }
    ];

    for (const roomData of rooms) {
      const room = AppDataSource.getRepository(Room).create(roomData);
      await AppDataSource.getRepository(Room).save(room);
    }

    // Створення СПА-послуг
    const spaServices = [
      {
        name: 'Класичний масаж',
        description: 'Розслабляючий масаж всього тіла для зняття напруги та відновлення енергії.',
        price: 800,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        isAvailable: true
      },
      {
        name: 'Аромамасаж',
        description: 'Масаж з використанням ароматичних олій для глибокого розслаблення та гармонізації.',
        price: 1000,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        isAvailable: true
      },
      {
        name: 'Спа-догляд для обличчя',
        description: 'Комплексний догляд за обличчям з використанням професійної косметики.',
        price: 1200,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        isAvailable: true
      },
      {
        name: 'Стоун-терапія',
        description: 'Масаж гарячими каменями для глибокого розслаблення м\'язів та покращення кровообігу.',
        price: 1500,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        isAvailable: true
      },
      {
        name: 'Спа-програма для пари',
        description: 'Романтична спа-програма для двох з масажем, ароматерапією та шампанським.',
        price: 2500,
        duration: 120,
        image: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
        isAvailable: true
      }
    ];

    for (const spaData of spaServices) {
      const spa = AppDataSource.getRepository(SpaService).create(spaData);
      await AppDataSource.getRepository(SpaService).save(spa);
    }

    // Створення тестових бронювань
    const rooms1 = await AppDataSource.getRepository(Room).find();
    
    if (rooms1.length > 0 && user) {
      const booking = AppDataSource.getRepository(Booking).create({
        checkIn: new Date('2023-12-20'),
        checkOut: new Date('2023-12-25'),
        totalPrice: rooms1[0].price * 5,
        status: 'confirmed',
        guestCount: 2,
        specialRequests: 'Номер на високому поверсі з видом на місто',
        room: rooms1[0],
        user: user
      });
      await AppDataSource.getRepository(Booking).save(booking);
    }

    console.log('База даних успішно заповнена тестовими даними');
  } catch (error) {
    console.error('Помилка при заповненні бази даних:', error);
  }
};
