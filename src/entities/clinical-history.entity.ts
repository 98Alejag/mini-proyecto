import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ClinicalHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  date: string;

  @Column({ nullable: false })
  reasonForVisit: string;

  @Column({ nullable: false })
  diagnosis: string;

  @Column({ nullable: true })
  proposedTreatment?: string;

  // Relation: one history belongs to one patient (user)
  @ManyToOne(() => User, (user) => user.clinicalHistories, { onDelete: 'CASCADE' })
  patient: User;
}
