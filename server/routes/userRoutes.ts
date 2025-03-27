import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Реєстрація нового користувача
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;
    const userRepository = getRepository(User);
    
    // Перевірка, чи email вже використовується
    const existingUser = await userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким email вже існує' });
    }
    
    // Хешування пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Створення нового користувача
    const newUser = userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      role: 'user'
    });
    
    await userRepository.save(newUser);
    
    // Створення JWT токена
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Помилка при реєстрації користувача', error: error.message });
  }
});

// Вхід користувача
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRepository = getRepository(User);
    
    // Пошук користувача за email
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    
    // Перевірка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Невірний пароль' });
    }
    
    // Створення JWT токена
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Помилка при вході в систему', error: error.message });
  }
});

// Отримати профіль користувача
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.user.id } });
    
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    
    // Видаляємо пароль з відповіді
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Помилка при отриманні профілю користувача', error: error.message });
  }
});

// Оновити профіль користувача
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    const userRepository = getRepository(User);
    
    const user = await userRepository.findOne({ where: { id: req.user.id } });
    
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    
    // Оновлення даних користувача
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    
    await userRepository.save(user);
    
    // Видаляємо пароль з відповіді
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Помилка при оновленні профілю користувача', error: error.message });
  }
});

// Зміна пароля
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userRepository = getRepository(User);
    
    // Пошук користувача
    const user = await userRepository.findOne({ where: { id: req.user.id } });
    
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    
    // Перевірка поточного пароля
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Поточний пароль невірний' });
    }
    
    // Хешування нового пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Оновлення пароля
    user.password = hashedPassword;
    await userRepository.save(user);
    
    res.status(200).json({ message: 'Пароль успішно змінено' });
  } catch (error: any) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Помилка при зміні пароля', error: error.message });
  }
});

// Отримати всіх користувачів (тільки для адміністраторів)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    
    // Видаляємо паролі з відповіді
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json(usersWithoutPasswords);
  } catch (error: any) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Помилка при отриманні списку користувачів', error: error.message });
  }
});

// Отримати користувача за ID (тільки для адміністраторів)
router.get('/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userRepository = getRepository(User);
    
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });
    
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    
    // Видаляємо пароль з відповіді
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error(`Error fetching user with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Помилка при отриманні користувача', error: error.message });
  }
});

// Оновити користувача (тільки для адміністраторів)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, phone, address } = req.body;
    const userRepository = getRepository(User);
    
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });
    
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    
    // Оновлення даних користувача
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    
    await userRepository.save(user);
    
    // Видаляємо пароль з відповіді
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error(`Error updating user with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Помилка при оновленні користувача', error: error.message });
  }
});

// Видалити користувача (тільки для адміністраторів)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userRepository = getRepository(User);
    
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });
    
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    
    await userRepository.remove(user);
    
    res.status(200).json({ message: 'Користувача успішно видалено' });
  } catch (error: any) {
    console.error(`Error deleting user with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Помилка при видаленні користувача', error: error.message });
  }
});

export default router;
