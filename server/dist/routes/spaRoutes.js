"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const SpaService_1 = __importDefault(require("../models/SpaService"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Тестові дані для розробки
const mockSpaServices = [
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
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Спроба отримати дані з MongoDB
        let services = [];
        try {
            services = yield SpaService_1.default.find({ isAvailable: true });
        }
        catch (dbError) {
            console.log('Помилка при отриманні даних з MongoDB, використовуємо тестові дані:', dbError);
        }
        // Якщо немає даних з MongoDB, використовуємо тестові дані
        if (!services || services.length === 0) {
            services = mockSpaServices;
        }
        res.status(200).json(services);
    }
    catch (error) {
        console.error('Помилка при отриманні СПА послуг:', error);
        res.status(500).json({ message: 'Помилка при отриманні СПА послуг', error });
    }
}));
// Отримати СПА послугу за ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Спроба отримати дані з MongoDB
        let service = null;
        try {
            service = yield SpaService_1.default.findById(req.params.id);
        }
        catch (dbError) {
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
    }
    catch (error) {
        console.error('Помилка при отриманні СПА послуги:', error);
        res.status(500).json({ message: 'Помилка при отриманні СПА послуги', error });
    }
}));
// Створити нову СПА послугу (тільки адмін)
router.post('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newService = new SpaService_1.default(req.body);
        const savedService = yield newService.save();
        res.status(201).json(savedService);
    }
    catch (error) {
        console.error('Помилка при створенні СПА послуги:', error);
        res.status(500).json({ message: 'Помилка при створенні СПА послуги', error });
    }
}));
// Оновити СПА послугу (тільки адмін)
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedService = yield SpaService_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedService) {
            return res.status(404).json({ message: 'СПА послугу не знайдено' });
        }
        res.status(200).json(updatedService);
    }
    catch (error) {
        console.error('Помилка при оновленні СПА послуги:', error);
        res.status(500).json({ message: 'Помилка при оновленні СПА послуги', error });
    }
}));
// Видалити СПА послугу (тільки адмін)
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedService = yield SpaService_1.default.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: 'СПА послугу не знайдено' });
        }
        res.status(200).json({ message: 'СПА послугу успішно видалено' });
    }
    catch (error) {
        console.error('Помилка при видаленні СПА послуги:', error);
        res.status(500).json({ message: 'Помилка при видаленні СПА послуги', error });
    }
}));
// Отримати СПА послуги за категорією
router.get('/category/:category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let services = [];
        try {
            services = yield SpaService_1.default.find({
                category,
                isAvailable: true
            });
        }
        catch (dbError) {
            console.log('Помилка при отриманні даних з MongoDB, використовуємо тестові дані:', dbError);
        }
        // Якщо немає даних з MongoDB, використовуємо тестові дані
        if (!services || services.length === 0) {
            services = mockSpaServices.filter(s => s.category === category);
        }
        res.status(200).json(services);
    }
    catch (error) {
        console.error('Помилка при отриманні СПА послуг за категорією:', error);
        res.status(500).json({ message: 'Помилка при отриманні СПА послуг за категорією', error });
    }
}));
// Бронювання СПА послуги
router.post('/book', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceId, date, time, notes } = req.body;
        if (!serviceId || !date || !time) {
            return res.status(400).json({ message: 'Всі поля обов\'язкові' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({ message: 'Невірний формат ID послуги' });
        }
        // Перевірка наявності послуги
        let service = null;
        try {
            service = yield SpaService_1.default.findById(serviceId);
        }
        catch (dbError) {
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
    }
    catch (error) {
        console.error('Помилка при бронюванні СПА послуги:', error);
        res.status(500).json({ message: 'Помилка при бронюванні СПА послуги', error });
    }
}));
exports.default = router;
