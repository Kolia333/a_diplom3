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
const database_1 = require("../database/database");
const Booking_1 = require("../entities/Booking");
const Room_1 = require("../entities/Room");
const User_1 = require("../entities/User");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const bookingRepository = database_1.AppDataSource.getRepository(Booking_1.Booking);
const roomRepository = database_1.AppDataSource.getRepository(Room_1.Room);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
// Отримати всі бронювання (тільки для адміністраторів)
router.get('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield bookingRepository.find({
            relations: ['user', 'room']
        });
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні бронювань', error });
    }
}));
// Отримати бронювання користувача
router.get('/user', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const bookings = yield bookingRepository.find({
            where: { user: { id: userId } },
            relations: ['room']
        });
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні бронювань користувача', error });
    }
}));
// Отримати бронювання за ID
router.get('/:id', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bookingId = parseInt(id);
        if (isNaN(bookingId)) {
            return res.status(400).json({ message: 'Невірний формат ID' });
        }
        const booking = yield bookingRepository.findOne({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні бронювання', error });
    }
}));
// Створити нове бронювання
router.post('/', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, checkIn, checkOut, guestCount, specialRequests } = req.body;
        const userId = req.user.id;
        // Перевірка наявності обов'язкових полів
        if (!roomId || !checkIn || !checkOut || !guestCount) {
            return res.status(400).json({ message: 'Всі обов\'язкові поля повинні бути заповнені' });
        }
        // Перевірка правильності дат
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (checkInDate >= checkOutDate) {
            return res.status(400).json({ message: 'Дата виїзду повинна бути пізніше дати заїзду' });
        }
        // Перевірка, чи існує номер
        const room = yield roomRepository.findOne({ where: { id: roomId } });
        if (!room) {
            return res.status(404).json({ message: 'Номер не знайдено' });
        }
        // Перевірка, чи доступний номер на вказані дати
        const existingBookings = yield bookingRepository.find({
            where: {
                room: { id: roomId },
                status: 'підтверджено',
                checkIn: (0, typeorm_1.LessThanOrEqual)(checkOutDate),
                checkOut: (0, typeorm_1.MoreThanOrEqual)(checkInDate)
            }
        });
        if (existingBookings.length > 0) {
            return res.status(400).json({ message: 'Номер недоступний на вказані дати' });
        }
        // Перевірка, чи існує користувач
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        // Розрахунок кількості днів і загальної вартості
        const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = room.price * days;
        // Створення нового бронювання
        const newBooking = bookingRepository.create({
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guestCount,
            specialRequests,
            totalPrice,
            status: 'очікує підтвердження',
            room,
            user
        });
        const savedBooking = yield bookingRepository.save(newBooking);
        res.status(201).json(savedBooking);
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при створенні бронювання', error });
    }
}));
// Оновити статус бронювання (тільки для адміністраторів)
router.put('/:id/status', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const booking = yield bookingRepository.findOne({ where: { id: bookingId } });
        if (!booking) {
            return res.status(404).json({ message: 'Бронювання не знайдено' });
        }
        // Оновлення статусу
        booking.status = status;
        const updatedBooking = yield bookingRepository.save(booking);
        res.status(200).json(updatedBooking);
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при оновленні статусу бронювання', error });
    }
}));
// Скасувати бронювання
router.put('/:id/cancel', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bookingId = parseInt(id);
        const userId = req.user.id;
        if (isNaN(bookingId)) {
            return res.status(400).json({ message: 'Невірний формат ID' });
        }
        // Перевірка, чи існує бронювання
        const booking = yield bookingRepository.findOne({
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
        const updatedBooking = yield bookingRepository.save(booking);
        res.status(200).json(updatedBooking);
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при скасуванні бронювання', error });
    }
}));
// Видалити бронювання (тільки для адміністраторів)
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bookingId = parseInt(id);
        if (isNaN(bookingId)) {
            return res.status(400).json({ message: 'Невірний формат ID' });
        }
        // Перевірка, чи існує бронювання
        const booking = yield bookingRepository.findOne({ where: { id: bookingId } });
        if (!booking) {
            return res.status(404).json({ message: 'Бронювання не знайдено' });
        }
        // Видалення бронювання
        yield bookingRepository.remove(booking);
        res.status(200).json({ message: 'Бронювання успішно видалено' });
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні бронювання', error });
    }
}));
exports.default = router;
