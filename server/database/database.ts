import { DataSource } from 'typeorm';
import path from 'path';
import { Room, User, Booking, SpaService } from '../entities';
import { seedDatabase } from '../seedData.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../hotel-marialux.sqlite'),
  entities: [Room, User, Booking, SpaService],
  synchronize: true, // В продакшн режимі краще використовувати міграції
  logging: process.env.NODE_ENV !== 'production',
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('SQLite database connection established');
    
    // Заповнення бази даних тестовими даними
    await seedDatabase();
    
    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
