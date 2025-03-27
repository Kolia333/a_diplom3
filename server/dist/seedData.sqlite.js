"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const database_1 = require("./database/database");
const entities_1 = require("./entities");
const bcrypt = __importStar(require("bcrypt"));
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Перевірка, чи є вже дані в базі
        const roomCount = yield database_1.AppDataSource.getRepository(entities_1.Room).count();
        const userCount = yield database_1.AppDataSource.getRepository(entities_1.User).count();
        const spaCount = yield database_1.AppDataSource.getRepository(entities_1.SpaService).count();
        if (roomCount > 0 && userCount > 0 && spaCount > 0) {
            console.log('База даних вже містить тестові дані');
            return;
        }
        console.log('Заповнення бази даних тестовими даними...');
        // Створення адміністратора
        const adminPassword = yield bcrypt.hash('admin123', 10);
        const admin = database_1.AppDataSource.getRepository(entities_1.User).create({
            firstName: 'Адміністратор',
            lastName: 'Системи',
            email: 'admin@marialux.com',
            password: adminPassword,
            role: 'admin',
            phone: '+380991234567',
            address: 'м. Київ, вул. Хрещатик, 1'
        });
        yield database_1.AppDataSource.getRepository(entities_1.User).save(admin);
        // Створення тестового користувача
        const userPassword = yield bcrypt.hash('user123', 10);
        const user = database_1.AppDataSource.getRepository(entities_1.User).create({
            firstName: 'Іван',
            lastName: 'Петренко',
            email: 'user@example.com',
            password: userPassword,
            role: 'user',
            phone: '+380991234568',
            address: 'м. Львів, вул. Франка, 15'
        });
        yield database_1.AppDataSource.getRepository(entities_1.User).save(user);
        // Створення номерів
        const rooms = [
            {
                name: 'Стандартний номер',
                type: 'стандарт',
                price: 1200,
                capacity: 2,
                description: 'Комфортний стандартний номер з усіма зручностями для двох осіб.',
                amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Душ'],
                images: [
                    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
                    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
                ],
                isAvailable: true
            },
            {
                name: 'Люкс',
                type: 'люкс',
                price: 2500,
                capacity: 2,
                description: 'Розкішний номер з окремою вітальнею та спальнею, ідеальний для пар.',
                amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Ванна', 'Халати', 'Тапочки', 'Сейф'],
                images: [
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
                    'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
                ],
                isAvailable: true
            },
            {
                name: 'Сімейний номер',
                type: 'сімейний',
                price: 3000,
                capacity: 4,
                description: 'Просторий номер для всієї родини з двома спальнями та зручностями для дітей.',
                amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Ванна', 'Дитяче ліжечко', 'Ігрова зона'],
                images: [
                    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
                ],
                isAvailable: true
            },
            {
                name: 'Президентський люкс',
                type: 'президентський',
                price: 5000,
                capacity: 2,
                description: 'Найрозкішніший номер у готелі з панорамними вікнами, джакузі та персональним обслуговуванням.',
                amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Джакузі', 'Сауна', 'Тераса', 'Персональний дворецький'],
                images: [
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
                ],
                isAvailable: true
            }
        ];
        for (const roomData of rooms) {
            const room = database_1.AppDataSource.getRepository(entities_1.Room).create(roomData);
            yield database_1.AppDataSource.getRepository(entities_1.Room).save(room);
        }
        // Створення СПА-послуг
        const spaServices = [
            {
                name: 'Класичний масаж',
                description: 'Розслабляючий масаж всього тіла для зняття напруги та відновлення енергії.',
                price: 800,
                duration: 60,
                image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                isAvailable: true
            },
            {
                name: 'Аромамасаж',
                description: 'Масаж з використанням ароматичних олій для глибокого розслаблення та гармонізації.',
                price: 1000,
                duration: 90,
                image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                isAvailable: true
            },
            {
                name: 'Спа-догляд для обличчя',
                description: 'Комплексний догляд за обличчям з використанням професійної косметики.',
                price: 1200,
                duration: 60,
                image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                isAvailable: true
            },
            {
                name: 'Стоун-терапія',
                description: 'Масаж гарячими каменями для глибокого розслаблення м\'язів та покращення кровообігу.',
                price: 1500,
                duration: 90,
                image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                isAvailable: true
            },
            {
                name: 'Спа-програма для пари',
                description: 'Романтична спа-програма для двох з масажем, ароматерапією та шампанським.',
                price: 2500,
                duration: 120,
                image: 'https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
                isAvailable: true
            }
        ];
        for (const spaData of spaServices) {
            const spa = database_1.AppDataSource.getRepository(entities_1.SpaService).create(spaData);
            yield database_1.AppDataSource.getRepository(entities_1.SpaService).save(spa);
        }
        // Створення тестових бронювань
        const rooms1 = yield database_1.AppDataSource.getRepository(entities_1.Room).find();
        if (rooms1.length > 0 && user) {
            const booking = database_1.AppDataSource.getRepository(entities_1.Booking).create({
                checkIn: new Date('2023-12-20'),
                checkOut: new Date('2023-12-25'),
                totalPrice: rooms1[0].price * 5,
                status: 'confirmed',
                guestCount: 2,
                specialRequests: 'Номер на високому поверсі з видом на місто',
                room: rooms1[0],
                user: user
            });
            yield database_1.AppDataSource.getRepository(entities_1.Booking).save(booking);
        }
        console.log('База даних успішно заповнена тестовими даними');
    }
    catch (error) {
        console.error('Помилка при заповненні бази даних:', error);
    }
});
exports.seedDatabase = seedDatabase;
