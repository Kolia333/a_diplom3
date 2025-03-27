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
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const entities_1 = require("../entities");
const seedData_sqlite_1 = require("../seedData.sqlite");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: path_1.default.join(__dirname, '../../hotel-marialux.sqlite'),
    entities: [entities_1.Room, entities_1.User, entities_1.Booking, entities_1.SpaService],
    synchronize: true,
    logging: process.env.NODE_ENV !== 'production',
});
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        console.log('SQLite database connection established');
        // Заповнення бази даних тестовими даними
        yield (0, seedData_sqlite_1.seedDatabase)();
        return exports.AppDataSource;
    }
    catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
});
exports.initializeDatabase = initializeDatabase;
