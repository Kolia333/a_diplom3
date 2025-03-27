import express from 'express';
import { AppDataSource } from '../database/database';
import { Room } from '../entities/Room';
import { Booking } from '../entities/Booking';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const roomRepository = AppDataSource.getRepository(Room);
const bookingRepository = AppDataSource.getRepository(Booking);

// Отримати всі номери
router.get('/', async (req, res) => {
  try {
    const rooms = await roomRepository.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні номерів', error });
  }
});

// Отримати номер за ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);
    
    if (isNaN(roomId)) {
      return res.status(400).json({ message: 'Невірний формат ID' });
    }
    
    const room = await roomRepository.findOne({ where: { id: roomId } });
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не знайдено' });
    }
    
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні номера', error });
  }
});

// Створити новий номер (тільки для адміністраторів)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newRoom = roomRepository.create(req.body);
    const savedRoom = await roomRepository.save(newRoom);
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при створенні номера', error });
  }
});

// Оновити номер (тільки для адміністраторів)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);
    
    if (isNaN(roomId)) {
      return res.status(400).json({ message: 'Невірний формат ID' });
    }
    
    const room = await roomRepository.findOne({ where: { id: roomId } });
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не знайдено' });
    }
    
    roomRepository.merge(room, req.body);
    const updatedRoom = await roomRepository.save(room);
    
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при оновленні номера', error });
  }
});

// Видалити номер (тільки для адміністраторів)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);
    
    if (isNaN(roomId)) {
      return res.status(400).json({ message: 'Невірний формат ID' });
    }
    
    const room = await roomRepository.findOne({ where: { id: roomId } });
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не знайдено' });
    }
    
    await roomRepository.remove(room);
    
    res.status(200).json({ message: 'Номер успішно видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при видаленні номера', error });
  }
});

// Перевірка доступності номера
router.get('/check-availability/:id', async (req, res) => {
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
    
    const room = await roomRepository.findOne({ where: { id: roomId } });
    
    if (!room) {
      return res.status(404).json({ message: 'Номер не знайдено' });
    }
    
    if (!room.isAvailable) {
      return res.status(200).json({ available: false, message: 'Номер недоступний' });
    }
    
    // Перевірка бронювань на вказані дати
    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);
    
    const bookings = await bookingRepository.find({
      where: {
        room: { id: roomId },
        status: 'confirmed',
        checkIn: LessThanOrEqual(checkOutDate),
        checkOut: MoreThanOrEqual(checkInDate)
      }
    });
    
    if (bookings.length > 0) {
      return res.status(200).json({ available: false, message: 'Номер зайнятий на вказані дати' });
    }
    
    res.status(200).json({ available: true, message: 'Номер доступний на вказані дати' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при перевірці доступності номера', error });
  }
});

export default router;
