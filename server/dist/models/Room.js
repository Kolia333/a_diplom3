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
const RoomSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Назва номера обов\'язкова'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Тип номера обов\'язковий'],
        enum: ['стандарт', 'люкс', 'сімейний', 'президентський'],
        default: 'стандарт'
    },
    price: {
        type: Number,
        required: [true, 'Ціна номера обов\'язкова'],
        min: [0, 'Ціна не може бути від\'ємною']
    },
    capacity: {
        type: Number,
        required: [true, 'Кількість місць обов\'язкова'],
        min: [1, 'Мінімальна кількість місць - 1']
    },
    description: {
        type: String,
        required: [true, 'Опис номера обов\'язковий']
    },
    amenities: {
        type: [String],
        default: []
    },
    images: {
        type: [String],
        default: []
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model('Room', RoomSchema);
