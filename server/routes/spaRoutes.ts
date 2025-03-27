import express from 'express';
import mongoose from 'mongoose';
import SpaService from '../models/SpaService';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Інтерфейс для СПА послуги
interface ISpaService {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  isAvailable?: boolean;
}

// Тестові дані для розробки
const mockSpaServices: ISpaService[] = [
  {
    _id: '1',
    title: 'Класичний масаж',
    description: 'Розслабляючий масаж всього тіла для зняття напруги та відновлення енергії',
    duration: '60 хв',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'масаж',
    isAvailable: true
  },
  {
    _id: '2',
    title: 'Арома-терапія',
    description: 'Заспокійливий масаж з використанням ефірних олій для повного розслаблення',
    duration: '90 хв',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'масаж',
    isAvailable: true
  },
  {
    _id: '3',
    title: 'Стоун-терапія',
    description: 'Масаж гарячими каменями для глибокого розслаблення м\'язів',
    duration: '90 хв',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'масаж',
    isAvailable: true
  },
  {
    _id: '4',
    title: 'Спа-догляд для обличчя',
    description: 'Комплексний догляд за шкірою обличчя з використанням преміальної косметики',
    duration: '60 хв',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'догляд за обличчям',
    isAvailable: true
  }
];

// Отримати всі СПА послуги
router.get('/', async (req, res) => {
  try {
    // Спроба отримати дані з MongoDB
    let services: ISpaService[] = [];
    try {
      services = await SpaService.find({ isAvailable: true });
    } catch (dbError) {
      console.log('Помилка при отриманні даних з MongoDB, використовуємо тестові дані:', dbError);
    }
    
    // Якщо немає даних з MongoDB, використовуємо тестові дані
    if (!services || services.length === 0) {
      services = mockSpaServices;
    }
    
    res.status(200).json(services);
  } catch (error) {
    console.error('Помилка при отриманні СПА послуг:', error);
    res.status(500).json({ message: 'Помилка при отриманні СПА послуг', error });
  }
});

// Отримати СПА послугу за ID
router.get('/:id', async (req, res) => {
  try {
    // Спроба отримати дані з MongoDB
    let service: ISpaService | null = null;
    try {
      service = await SpaService.findById(req.params.id);
    } catch (dbError) {
      console.log('Помилка при отриманні даних з MongoDB, використовуємо тестові дані:', dbError);
    }
    
    // Якщо немає даних з MongoDB, використовуємо тестові дані
    if (!service) {
      service = mockSpaServices.find(s => s._id === req.params.id) || null;
    }
    
    if (!service) {
      return res.status(404).json({ message: 'СПА послугу не знайдено' });
    }
    
    res.status(200).json(service);
  } catch (error) {
    console.error('Помилка при отриманні СПА послуги:', error);
    res.status(500).json({ message: 'Помилка при отриманні СПА послуги', error });
  }
});

// Створити нову СПА послугу (тільки адмін)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newService = new SpaService(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Помилка при створенні СПА послуги:', error);
    res.status(500).json({ message: 'Помилка при створенні СПА послуги', error });
  }
});

// Оновити СПА послугу (тільки адмін)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedService = await SpaService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return res.status(404).json({ message: 'СПА послугу не знайдено' });
    }
    
    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Помилка при оновленні СПА послуги:', error);
    res.status(500).json({ message: 'Помилка при оновленні СПА послуги', error });
  }
});

// Видалити СПА послугу (тільки адмін)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedService = await SpaService.findByIdAndDelete(req.params.id);
    
    if (!deletedService) {
      return res.status(404).json({ message: 'СПА послугу не знайдено' });
    }
    
    res.status(200).json({ message: 'СПА послугу успішно видалено' });
  } catch (error) {
    console.error('Помилка при видаленні СПА послуги:', error);
    res.status(500).json({ message: 'Помилка при видаленні СПА послуги', error });
  }
});

// Отримати СПА послуги за категорією
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const validCategories = ['масаж', 'догляд за обличчям', 'догляд за тілом', 'спа-ритуали'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Невірна категорія',
        validCategories
      });
    }
    
    // Спроба отримати дані з MongoDB
    let services: ISpaService[] = [];
    try {
      services = await SpaService.find({ 
        category,
        isAvailable: true
      });
    } catch (dbError) {
      console.log('Помилка при отриманні даних з MongoDB, використовуємо тестові дані:', dbError);
    }
    
    // Якщо немає даних з MongoDB, використовуємо тестові дані
    if (!services || services.length === 0) {
      services = mockSpaServices.filter(s => s.category === category);
    }
    
    res.status(200).json(services);
  } catch (error) {
    console.error('Помилка при отриманні СПА послуг за категорією:', error);
    res.status(500).json({ message: 'Помилка при отриманні СПА послуг за категорією', error });
  }
});

// Бронювання СПА послуги
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { serviceId, date, time, notes } = req.body;
    
    if (!serviceId || !date || !time) {
      return res.status(400).json({ message: 'Всі поля обов\'язкові' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: 'Невірний формат ID послуги' });
    }
    
    // Перевірка наявності послуги
    let service: ISpaService | null = null;
    try {
      service = await SpaService.findById(serviceId);
    } catch (dbError) {
      console.log('Помилка при отриманні даних з MongoDB, використовуємо тестові дані:', dbError);
    }
    
    // Якщо немає даних з MongoDB, використовуємо тестові дані
    if (!service) {
      service = mockSpaServices.find(s => s._id === serviceId) || null;
    }
    
    if (!service) {
      return res.status(404).json({ message: 'СПА послугу не знайдено' });
    }
    
    if (service.isAvailable === false) {
      return res.status(400).json({ message: 'СПА послуга недоступна' });
    }
    
    // Тут буде логіка створення бронювання СПА послуги
    // Це спрощена версія, яка просто повертає успішну відповідь
    
    res.status(200).json({ 
      message: 'СПА послугу успішно заброньовано',
      booking: {
        service: service,
        date,
        time,
        notes,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Помилка при бронюванні СПА послуги:', error);
    res.status(500).json({ message: 'Помилка при бронюванні СПА послуги', error });
  }
});

export default router;
