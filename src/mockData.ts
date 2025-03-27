// Тестові дані для використання, коли API недоступний

export const mockRooms = [
  {
    _id: '1',
    name: 'Стандартний одномісний',
    type: 'стандарт',
    price: 1200,
    capacity: 1,
    description: 'Комфортний стандартний номер з усіма зручностями для однієї особи.',
    amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Душ'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
    ],
    isAvailable: true
  },
  {
    _id: '2',
    name: 'Стандартний двомісний',
    type: 'стандарт',
    price: 1800,
    capacity: 2,
    description: 'Комфортний стандартний номер з усіма зручностями для двох осіб.',
    amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Душ'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
    ],
    isAvailable: true
  },
  {
    _id: '3',
    name: 'Люкс з видом на море',
    type: 'люкс',
    price: 3000,
    capacity: 2,
    description: 'Розкішний номер з видом на море, окремою вітальнею та спальнею, ідеальний для пар.',
    amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Ванна', 'Халати', 'Тапочки', 'Сейф'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
    ],
    isAvailable: true
  },
  {
    _id: '4',
    name: 'Сімейний люкс',
    type: 'сімейний',
    price: 3500,
    capacity: 4,
    description: 'Просторий номер для всієї родини з двома спальнями та зручностями для дітей.',
    amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Ванна', 'Дитяче ліжечко', 'Ігрова зона'],
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    isAvailable: true
  },
  {
    _id: '5',
    name: 'Президентський люкс',
    type: 'президентський',
    price: 6000,
    capacity: 2,
    description: 'Найрозкішніший номер у готелі з панорамними вікнами, джакузі та персональним обслуговуванням.',
    amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Джакузі', 'Сауна', 'Тераса', 'Персональний дворецький'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    isAvailable: true
  }
];

export const mockBookings = [
  {
    _id: '1',
    roomId: '1',
    userId: '1',
    checkIn: '2023-06-01',
    checkOut: '2023-06-05',
    guestCount: 1,
    totalPrice: 4800,
    status: 'підтверджено',
    createdAt: '2023-05-20T10:30:00.000Z'
  }
];

export const mockSpaServices = [
  {
    _id: '1',
    name: 'Класичний масаж',
    title: 'Класичний масаж',
    description: 'Розслабляючий масаж всього тіла',
    price: 800,
    duration: '60',
    category: 'масаж',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    _id: '2',
    name: 'Спа для пари',
    title: 'Спа для пари',
    description: 'Романтичний спа-пакет для двох',
    price: 2000,
    duration: '120',
    category: 'спа',
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  }
];

export const mockUsers = [
  {
    _id: '1',
    firstName: 'Іван',
    lastName: 'Петренко',
    email: 'user@example.com',
    password: '$2a$10$X7tUzuLmUDLX5NsLQrZpKe6gTI4xyYOUmI.Y9oRVNYjHbZEGfLW1G', // зашифрований пароль "user123"
    role: 'user',
    phone: '+380991234568',
    address: 'м. Львів, вул. Франка, 15'
  },
  {
    _id: '2',
    firstName: 'Адміністратор',
    lastName: 'Системи',
    email: 'admin@marialux.com',
    password: '$2a$10$X7tUzuLmUDLX5NsLQrZpKe6gTI4xyYOUmI.Y9oRVNYjHbZEGfLW1G', // зашифрований пароль "admin123"
    role: 'admin',
    phone: '+380991234567',
    address: 'м. Київ, вул. Хрещатик, 1'
  }
];
