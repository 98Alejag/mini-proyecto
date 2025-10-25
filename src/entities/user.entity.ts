import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsEmail, MinLength, IsOptional} from "class-validator";
import { ClinicalHistory } from "./clinical-history.entity";

export type Roles = 'admin' | 'doctor' | 'patient'

export enum RolesEnum {
    ADMIN = 'admin',
    DOCTOR = 'doctor',
    PATIENT = 'patient'
    
}

@Entity()
export class User {
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

  @Column({ nullable: false })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'La Direccion es obligatoria' })
  address: string;

  @Column({ nullable: true })
  @IsOptional()
  age?: number;

  @Column({ default: true })
  status: boolean;

  @Column({default: RolesEnum.PATIENT})
  role: RolesEnum;

   @OneToMany(() => ClinicalHistory, (history) => history.patient)
  clinicalHistories: ClinicalHistory[];
}