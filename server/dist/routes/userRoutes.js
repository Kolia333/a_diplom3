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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Реєстрація нового користувача
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        // Перевірка, чи email вже використовується
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }
        // Хешування пароля
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
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
        yield userRepository.save(newUser);
        // Створення JWT токена
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
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
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Помилка при реєстрації користувача', error: error.message });
    }
}));
// Вхід користувача
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        // Пошук користувача за email
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        // Перевірка пароля
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Невірний пароль' });
        }
        // Створення JWT токена
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
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
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Помилка при вході в систему', error: error.message });
    }
}));
// Отримати профіль користувача
router.get('/profile', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        // Видаляємо пароль з відповіді
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(200).json(userWithoutPassword);
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Помилка при отриманні профілю користувача', error: error.message });
    }
}));
// Оновити профіль користувача
router.put('/profile', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, phone, address } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        // Оновлення даних користувача
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        yield userRepository.save(user);
        // Видаляємо пароль з відповіді
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(200).json(userWithoutPassword);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Помилка при оновленні профілю користувача', error: error.message });
    }
}));
// Зміна пароля
router.put('/change-password', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        // Пошук користувача
        const user = yield userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        // Перевірка поточного пароля
        const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Поточний пароль невірний' });
        }
        // Хешування нового пароля
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
        // Оновлення пароля
        user.password = hashedPassword;
        yield userRepository.save(user);
        res.status(200).json({ message: 'Пароль успішно змінено' });
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Помилка при зміні пароля', error: error.message });
    }
}));
// Отримати всіх користувачів (тільки для адміністраторів)
router.get('/', authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const users = yield userRepository.find();
        // Видаляємо паролі з відповіді
        const usersWithoutPasswords = users.map(user => {
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        });
        res.status(200).json(usersWithoutPasswords);
    }
    catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Помилка при отриманні списку користувачів', error: error.message });
    }
}));
// Отримати користувача за ID (тільки для адміністраторів)
router.get('/:id', authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        // Видаляємо пароль з відповіді
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(200).json(userWithoutPassword);
    }
    catch (error) {
        console.error(`Error fetching user with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Помилка при отриманні користувача', error: error.message });
    }
}));
// Оновити користувача (тільки для адміністраторів)
router.put('/:id', authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, role, phone, address } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { id: parseInt(id) } });
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
        yield userRepository.save(user);
        // Видаляємо пароль з відповіді
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(200).json(userWithoutPassword);
    }
    catch (error) {
        console.error(`Error updating user with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Помилка при оновленні користувача', error: error.message });
    }
}));
// Видалити користувача (тільки для адміністраторів)
router.delete('/:id', authMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        yield userRepository.remove(user);
        res.status(200).json({ message: 'Користувача успішно видалено' });
    }
    catch (error) {
        console.error(`Error deleting user with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Помилка при видаленні користувача', error: error.message });
    }
}));
exports.default = router;
