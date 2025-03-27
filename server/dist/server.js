"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
require("reflect-metadata");
const database_1 = require("./database/database");
// Імпорт маршрутів
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const spaRoutes_1 = __importDefault(require("./routes/spaRoutes"));
// Конфігурація середовища
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5002;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Підключення до SQLite
(0, database_1.initializeDatabase)()
    .then(() => {
    console.log('Connected to SQLite database');
    // Маршрути API
    app.use('/api/rooms', roomRoutes_1.default);
    app.use('/api/bookings', bookingRoutes_1.default);
    app.use('/api/users', userRoutes_1.default);
    app.use('/api/spa', spaRoutes_1.default);
    // Обслуговування статичних файлів у продакшн режимі
    if (process.env.NODE_ENV === 'production') {
        app.use(express_1.default.static(path_1.default.join(__dirname, '../build')));
        app.get('*', (req, res) => {
            res.sendFile(path_1.default.join(__dirname, '../build', 'index.html'));
        });
    }
    // Обробка помилок
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            message: 'Щось пішло не так!',
            error: process.env.NODE_ENV === 'production' ? {} : err
        });
    });
    // Запуск сервера
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Database connection error:', error);
});
exports.default = app;
