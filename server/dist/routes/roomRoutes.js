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
const Room_1 = require("../entities/Room");
const Booking_1 = require("../entities/Booking");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const roomRepository = database_1.AppDataSource.getRepository(Room_1.Room);
const bookingRepository = database_1.AppDataSource.getRepository(Booking_1.Booking);
// Отримати всі номери
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield roomRepository.find();
        res.status(200).json(rooms);
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні номерів', error });
    }
}));
// Отримати номер за ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const roomId = parseInt(id);
        if (isNaN(roomId)) {
            return res.status(400).json({ message: 'Невірний формат ID' });
        }
        const room = yield roomRepository.findOne({ where: { id: roomId } });
        if (!room) {
            return res.status(404).json({ message: 'Номер не знайдено' });
        }
        res.status(200).json(room);
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні номера', error });
    }
}));
// Створити новий номер (тільки для адміністраторів)
router.post('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRoom = roomRepository.create(req.body);
        const savedRoom = yield roomRepository.save(newRoom);
        res.status(201).json(savedRoom);
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при створенні номера', error });
    }
}));
// Оновити номер (тільки для адміністраторів)
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const roomId = parseInt(id);
        if (isNaN(roomId)) {
            return res.status(400).json({ message: 'Невірний формат ID' });
        }
        const room = yield roomRepository.findOne({ where: { id: roomId } });
        if (!room) {
            return res.status(404).json({ message: 'Номер не знайдено' });
        }
        roomRepository.merge(room, req.body);
        const updatedRoom = yield roomRepository.save(room);
        res.status(200).json(updatedRoom);
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при оновленні номера', error });
    }
}));
// Видалити номер (тільки для адміністраторів)
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const roomId = parseInt(id);
        if (isNaN(roomId)) {
            return res.status(400).json({ message: 'Невірний формат ID' });
        }
        const room = yield roomRepository.findOne({ where: { id: roomId } });
        if (!room) {
            return res.status(404).json({ message: 'Номер не знайдено' });
        }
        yield roomRepository.remove(room);
        res.status(200).json({ message: 'Номер успішно видалено' });
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні номера', error });
    }
}));
// Перевірка доступності номера
router.get('/check-availability/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { checkIn, checkOut } = req.query;
        const roomId = parseInt(id);
        if (isNaN(roomId)) {
            return res.status(400).json({ message: 'Невірний формат ID' });
        }
        if (!checkIn || !checkOut) {
            return res.status(400).json({ message: 'Необхідно вказати дати заїзду та виїзду' });
        }
        const room = yield roomRepository.findOne({ where: { id: roomId } });
        if (!room) {
            return res.status(404).json({ message: 'Номер не знайдено' });
        }
        if (!room.isAvailable) {
            return res.status(200).json({ available: false, message: 'Номер недоступний' });
        }
        // Перевірка бронювань на вказані дати
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const bookings = yield bookingRepository.find({
            where: {
                room: { id: roomId },
                status: 'confirmed',
                checkIn: (0, typeorm_1.LessThanOrEqual)(checkOutDate),
                checkOut: (0, typeorm_1.MoreThanOrEqual)(checkInDate)
            }
        });
        if (bookings.length > 0) {
            return res.status(200).json({ available: false, message: 'Номер зайнятий на вказані дати' });
        }
        res.status(200).json({ available: true, message: 'Номер доступний на вказані дати' });
    }
    catch (error) {
        res.status(500).json({ message: 'Помилка при перевірці доступності номера', error });
    }
}));
exports.default = router;
