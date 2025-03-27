import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

// Розширення інтерфейсу Request для додавання поля user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware для аутентифікації
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Auth middleware called');
    console.log('Headers:', req.headers);
    
    // Отримання токена з заголовка
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Необхідна аутентифікація' });
    }
    
    try {
      // Перевірка токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      console.log('Token decoded:', decoded);
      
      // Пошук користувача
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: decoded.id } });
      
      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Користувача не знайдено' });
      }
      
      // Додавання користувача до запиту
      req.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      };
      console.log('User attached to request:', req.user.email);
      next();
    } catch (error) {
      console.log('Token verification error:', error);
      res.status(401).json({ message: 'Недійсний токен авторизації' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Middleware для перевірки прав адміністратора
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('Admin middleware called');
  console.log('User role:', req.user?.role);
  
  if (req.user && req.user.role !== 'admin') {
    console.log('Access denied - not an admin');
    return res.status(403).json({ message: 'Доступ заборонено. Потрібні права адміністратора.' });
  }
  
  console.log('Admin access granted');
  next();
};
