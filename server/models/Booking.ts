import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Користувач обов\'язковий']
  },
  room: {
    type: Schema.Types.ObjectId,
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
BookingSchema.pre<IBooking>('save', function(next) {
  if (this.checkOut <= this.checkIn) {
    const error = new Error('Дата виїзду повинна бути пізніше дати заїзду');
    return next(error);
  }
  next();
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
