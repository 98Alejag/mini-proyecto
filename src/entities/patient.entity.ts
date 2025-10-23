import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsEmail, MinLength } from "class-validator";

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @Column({ nullable: false, unique: true })
  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @Column({ nullable: false })
  @IsNotEmpty({ message: 'El numero es obligatoria' })
  @MinLength(10, { message: 'El numero de teléfono debe tener al menos 10 numeros' })
  phone: string;

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'La edad es obligatoria' })
  age: number;

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'La Direccion es obligatoria' })
  address: string;

  @Column({ default: true })
  status: boolean;

  @Column ({default: 'Patient'})
  role: string;
}