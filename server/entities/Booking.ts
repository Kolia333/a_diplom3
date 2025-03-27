import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './Room';
import { User } from './User';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  checkIn: Date;

  @Column('date')
  checkOut: Date;

  @Column('float')
  totalPrice: number;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  guestCount: number;

  @Column({ nullable: true })
  specialRequests: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Room, 'bookings')
  @JoinColumn()
  room: Room;

  @ManyToOne(() => User, 'bookings')
  @JoinColumn()
  user: User;
}
