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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("./models/User"));
const Room_1 = __importDefault(require("./models/Room"));
const Booking_1 = __importDefault(require("./models/Booking"));
const SpaService_1 = __importDefault(require("./models/SpaService"));
const path_1 = __importDefault(require("path"));
// Завантаження змінних середовища
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// Підключення до MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-marialux';
console.log('Connecting to MongoDB:', MONGODB_URI);
// Тестові дані
const mockUsers = [
    {
        name: 'Адміністратор',
        email: 'admin@marialux.com',
        password: 'admin123',
        role: 'admin',
        phone: '+380991234567'
    },
    {
        name: 'Іван Петренко',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        phone: '+380997654321'
    }
];
const mockRooms = [
    {
        name: 'Стандартний номер',
        type: 'standard',
        price: 1200,
        capacity: 2,
        description: 'Комфортний номер з усіма необхідними зручностями для приємного відпочинку.',
        amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар'],
        images: [
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
        ],
        isAvailable: true
    },
    {
        name: 'Люкс',
        type: 'luxury',
        price: 2500,
        capacity: 2,
        description: 'Розкішний номер з панорамним видом на місто та додатковими послугами.',
        amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Сейф', 'Джакузі'],
        images: [
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bHV4dXJ5JTIwaG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
        ],
        isAvailable: true
    },
    {
        name: 'Сімейний номер',
        type: 'family',
        price: 1800,
        capacity: 4,
        description: 'Просторий номер для комфортного розміщення всієї родини.',
        amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Дитяче ліжко'],
        images: [
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFtaWx5JTIwaG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
        ],
        isAvailable: true
    },
    {
        name: 'Президентський люкс',
        type: 'presidential',
        price: 5000,
        capacity: 2,
        description: 'Найрозкішніший номер готелю з персональним обслуговуванням та ексклюзивними послугами.',
        amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Сейф', 'Джакузі', 'Сауна', 'Тераса'],
        images: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJlc2lkZW50aWFsJTIwc3VpdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        ],
        isAvailable: true
    }
];
const mockSpaServices = [
    {
        title: 'Класичний масаж',
        description: 'Розслаблюючий масаж всього тіла для зняття напруги та покращення кровообігу.',
        duration: '60 хв',
        price: 800,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        category: 'massage',
        isAvailable: true
    },
    {
        title: 'Ароматерапія',
        description: 'Процедура з використанням ефірних олій для покращення фізичного та емоційного стану.',
        duration: '45 хв',
        price: 700,
        image: 'https://images.unsplash.com/photo-1636377235886-4762f8ee5eca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFyb21hdGhlcmFweXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        category: 'aromatherapy',
        isAvailable: true
    },
    {
        title: 'Обгортання водоростями',
        description: 'Процедура для детоксикації організму та покращення стану шкіри.',
        duration: '90 хв',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3BhJTIwdHJlYXRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        category: 'body',
        isAvailable: true
    },
    {
        title: 'Фіш-пілінг',
        description: 'Унікальна процедура з використанням рибок Гарра Руфа для природного пілінгу шкіри.',
        duration: '30 хв',
        price: 500,
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlzaCUyMHNwYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        category: 'exotic',
        isAvailable: true
    },
    {
        title: 'Комплекс "Повне розслаблення"',
        description: 'Комплекс процедур, що включає масаж, ароматерапію та гідротерапію.',
        duration: '120 хв',
        price: 2000,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhJTIwcmVsYXh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        category: 'complex',
        isAvailable: true
    }
];
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('Connected to MongoDB');
            // Очищення колекцій перед заповненням
            yield User_1.default.deleteMany({});
            yield Room_1.default.deleteMany({});
            yield Booking_1.default.deleteMany({});
            yield SpaService_1.default.deleteMany({});
            console.log('Collections cleared');
            // Заповнення користувачів
            const hashedUsers = yield Promise.all(mockUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(user.password, salt);
                return Object.assign(Object.assign({}, user), { password: hashedPassword });
            })));
            const createdUsers = yield User_1.default.insertMany(hashedUsers);
            console.log('Users seeded');
            // Заповнення номерів
            const createdRooms = yield Room_1.default.insertMany(mockRooms);
            console.log('Rooms seeded');
            // Заповнення СПА-послуг
            yield SpaService_1.default.insertMany(mockSpaServices);
            console.log('Spa services seeded');
            // Заповнення бронювань
            const mockBookings = [
                {
                    user: createdUsers[1]._id,
                    room: createdRooms[0]._id,
                    checkIn: new Date('2025-04-01'),
                    checkOut: new Date('2025-04-05'),
                    guests: 2,
                    totalPrice: 4800,
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    specialRequests: 'Номер на вищому поверсі'
                },
                {
                    user: createdUsers[1]._id,
                    room: createdRooms[1]._id,
                    checkIn: new Date('2025-05-10'),
                    checkOut: new Date('2025-05-15'),
                    guests: 2,
                    totalPrice: 12500,
                    status: 'pending',
                    paymentStatus: 'pending',
                    specialRequests: 'Пізній заїзд'
                }
            ];
            yield Booking_1.default.insertMany(mockBookings);
            console.log('Bookings seeded');
            console.log('Database seeded successfully');
            process.exit(0);
        }
        catch (error) {
            console.error('Error seeding database:', error);
            process.exit(1);
        }
    });
}
seedDatabase();
