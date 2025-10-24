import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Treatment } from './treatment.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  datehour: Date;

  @Column({ type: 'int', default: 30 }) // duración en minutos
  durationMinutes: number;

  @ManyToOne(() => User, { eager: true })
  doctor: User;

  @ManyToOne(() => User, { eager: true })
  patient: User;

  @ManyToOne(() => Treatment, { eager: true })
  treatment: Treatment;

  @Column({ default: 'pendiente' })
  status: 'pendiente' | 'confirmada' | 'cancelada';

  @CreateDateColumn()
  createdAt: Date;
}
