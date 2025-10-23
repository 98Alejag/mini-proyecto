import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, Min, MaxLength } from 'class-validator';

@Entity()
export class Treatment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty({ message: 'El nombre del tratamiento es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @Column({ default: true })
  status: boolean;
}