import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  type: string;
  price: number;
  capacity: number;
  description: string;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
}

const RoomSchema: Schema = new Schema({
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

export default mongoose.model<IRoom>('Room', RoomSchema);
