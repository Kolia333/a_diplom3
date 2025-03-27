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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const BookingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Користувач обов\'язковий']
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, 'Номер обов\'язковий']
    },
    checkIn: {
        type: Date,
        required: [true, 'Дата заїзду обов\'язкова']
    },
    checkOut: {
        type: Date,
        required: [true, 'Дата виїзду обов\'язкова']
    },
    guests: {
        type: Number,
        required: [true, 'Кількість гостей обов\'язкова'],
        min: [1, 'Мінімальна кількість гостей - 1']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Загальна ціна обов\'язкова'],
        min: [0, 'Ціна не може бути від\'ємною']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    specialRequests: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Валідація дат
BookingSchema.pre('save', function (next) {
    if (this.checkOut <= this.checkIn) {
        const error = new Error('Дата виїзду повинна бути пізніше дати заїзду');
        return next(error);
    }
    next();
});
exports.default = mongoose_1.default.model('Booking', BookingSchema);
