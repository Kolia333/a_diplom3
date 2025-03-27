import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User';
import Room from './models/Room';
import Booking from './models/Booking';
import SpaService from './models/SpaService';
import path from 'path';

// Завантаження змінних середовища
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Підключення до MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-marialux';
console.log('Connecting to MongoDB:', MONGODB_URI);

// Тестові дані
const mockUsers = [
  {
    name: 'Адміністратор',
    email: 'admin@marialux.com',
    password: 'admin123',
    role: 'admin',
    phone: '+380991234567'
  },
  {
    name: 'Іван Петренко',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    phone: '+380997654321'
  }
];

const mockRooms = [
  {
    name: 'Стандартний номер',
    type: 'standard',
    price: 1200,
    capacity: 2,
    description: 'Комфортний номер з усіма необхідними зручностями для приємного відпочинку.',
    amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    ],
    isAvailable: true
  },
  {
    name: 'Люкс',
    type: 'luxury',
    price: 2500,
    capacity: 2,
    description: 'Розкішний номер з панорамним видом на місто та додатковими послугами.',
    amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Сейф', 'Джакузі'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bHV4dXJ5JTIwaG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    ],
    isAvailable: true
  },
  {
    name: 'Сімейний номер',
    type: 'family',
    price: 1800,
    capacity: 4,
    description: 'Просторий номер для комфортного розміщення всієї родини.',
    amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Дитяче ліжко'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFtaWx5JTIwaG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    ],
    isAvailable: true
  },
  {
    name: 'Президентський люкс',
    type: 'presidential',
    price: 5000,
    capacity: 2,
    description: 'Найрозкішніший номер готелю з персональним обслуговуванням та ексклюзивними послугами.',
    amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Сейф', 'Джакузі', 'Сауна', 'Тераса'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJlc2lkZW50aWFsJTIwc3VpdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    ],
    isAvailable: true
  }
];

const mockSpaServices = [
  {
    title: 'Класичний масаж',
    description: 'Розслаблюючий масаж всього тіла для зняття напруги та покращення кровообігу.',
    duration: '60 хв',
    price: 800,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    category: 'massage',
    isAvailable: true
  },
  {
    title: 'Ароматерапія',
    description: 'Процедура з використанням ефірних олій для покращення фізичного та емоційного стану.',
    duration: '45 хв',
    price: 700,
    image: 'https://images.unsplash.com/photo-1636377235886-4762f8ee5eca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFyb21hdGhlcmFweXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    category: 'aromatherapy',
    isAvailable: true
  },
  {
    title: 'Обгортання водоростями',
    description: 'Процедура для детоксикації організму та покращення стану шкіри.',
    duration: '90 хв',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3BhJTIwdHJlYXRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    category: 'body',
    isAvailable: true
  },
  {
    title: 'Фіш-пілінг',
    description: 'Унікальна процедура з використанням рибок Гарра Руфа для природного пілінгу шкіри.',
    duration: '30 хв',
    price: 500,
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlzaCUyMHNwYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    category: 'exotic',
    isAvailable: true
  },
  {
    title: 'Комплекс "Повне розслаблення"',
    description: 'Комплекс процедур, що включає масаж, ароматерапію та гідротерапію.',
    duration: '120 хв',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhJTIwcmVsYXh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    category: 'complex',
    isAvailable: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Очищення колекцій перед заповненням
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
    await SpaService.deleteMany({});
    console.log('Collections cleared');

    // Заповнення користувачів
    const hashedUsers = await Promise.all(
      mockUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Users seeded');

    // Заповнення номерів
    const createdRooms = await Room.insertMany(mockRooms);
    console.log('Rooms seeded');

    // Заповнення СПА-послуг
    await SpaService.insertMany(mockSpaServices);
    console.log('Spa services seeded');

    // Заповнення бронювань
    const mockBookings = [
      {
        user: createdUsers[1]._id, // Звичайний користувач
        room: createdRooms[0]._id, // Стандартний номер
        checkIn: new Date('2025-04-01'),
        checkOut: new Date('2025-04-05'),
        guests: 2,
        totalPrice: 4800,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: 'Номер на вищому поверсі'
      },
      {
        user: createdUsers[1]._id, // Звичайний користувач
        room: createdRooms[1]._id, // Люкс
        checkIn: new Date('2025-05-10'),
        checkOut: new Date('2025-05-15'),
        guests: 2,
        totalPrice: 12500,
        status: 'pending',
        paymentStatus: 'pending',
        specialRequests: 'Пізній заїзд'
      }
    ];
    
    await Booking.insertMany(mockBookings);
    console.log('Bookings seeded');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
