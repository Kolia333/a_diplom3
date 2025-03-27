// Тестові дані для використання, коли немає підключення до бази даних

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface IRoom {
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

export interface IBooking {
  _id: string;
  user: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: string;
}

export interface ISpaService {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

// Тестові користувачі
export const mockUsers: IUser[] = [
  {
    _id: '1',
    name: 'Адміністратор',
    email: 'admin@marialux.com',
    phone: '+380991234567',
    role: 'admin'
  },
  {
    _id: '2',
    name: 'Іван Петренко',
    email: 'user@example.com',
    phone: '+380997654321',
    role: 'user'
  }
];

// Тестові номери
export const mockRooms: IRoom[] = [
  {
    _id: '1',
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
    _id: '2',
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
    _id: '3',
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
    _id: '4',
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

// Тестові бронювання
export const mockBookings: IBooking[] = [
  {
    _id: '1',
    user: '2',
    room: '1',
    checkIn: '2025-04-01',
    checkOut: '2025-04-05',
    guests: 2,
    totalPrice: 4800,
    status: 'confirmed',
    paymentStatus: 'paid',
    specialRequests: 'Номер на вищому поверсі',
    createdAt: '2025-03-15'
  },
  {
    _id: '2',
    user: '2',
    room: '2',
    checkIn: '2025-05-10',
    checkOut: '2025-05-15',
    guests: 2,
    totalPrice: 12500,
    status: 'pending',
    paymentStatus: 'pending',
    specialRequests: 'Пізній заїзд',
    createdAt: '2025-03-20'
  }
];

// Тестові СПА-послуги
export const mockSpaServices: ISpaService[] = [
  {
    _id: '1',
    title: 'Класичний масаж',
    description: 'Розслаблюючий масаж всього тіла для зняття напруги та покращення кровообігу.',
    duration: '60 хв',
    price: 800,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    category: 'massage',
    isAvailable: true
  },
  {
    _id: '2',
    title: 'Ароматерапія',
    description: 'Процедура з використанням ефірних олій для покращення фізичного та емоційного стану.',
    duration: '45 хв',
    price: 700,
    image: 'https://images.unsplash.com/photo-1636377235886-4762f8ee5eca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFyb21hdGhlcmFweXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    category: 'aromatherapy',
    isAvailable: true
  },
  {
    _id: '3',
    title: 'Обгортання водоростями',
    description: 'Процедура для детоксикації організму та покращення стану шкіри.',
    duration: '90 хв',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3BhJTIwdHJlYXRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    category: 'body',
    isAvailable: true
  },
  {
    _id: '4',
    title: 'Фіш-пілінг',
    description: 'Унікальна процедура з використанням рибок Гарра Руфа для природного пілінгу шкіри.',
    duration: '30 хв',
    price: 500,
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlzaCUyMHNwYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    category: 'exotic',
    isAvailable: true
  },
  {
    _id: '5',
    title: 'Комплекс "Повне розслаблення"',
    description: 'Комплекс процедур, що включає масаж, ароматерапію та гідротерапію.',
    duration: '120 хв',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhJTIwcmVsYXh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    category: 'complex',
    isAvailable: true
  }
];
