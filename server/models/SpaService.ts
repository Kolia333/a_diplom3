import mongoose, { Document, Schema } from 'mongoose';

export interface ISpaService extends Document {
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
}

const SpaServiceSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Назва послуги обов\'язкова'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Опис послуги обов\'язковий']
  },
  duration: {
    type: String,
    required: [true, 'Тривалість послуги обов\'язкова']
  },
  price: {
    type: Number,
    required: [true, 'Ціна послуги обов\'язкова'],
    min: [0, 'Ціна не може бути від\'ємною']
  },
  image: {
    type: String,
    required: [true, 'Зображення послуги обов\'язкове']
  },
  category: {
    type: String,
    enum: ['масаж', 'догляд за обличчям', 'догляд за тілом', 'спа-ритуали'],
    default: 'масаж'
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

export default mongoose.model<ISpaService>('SpaService', SpaServiceSchema);
