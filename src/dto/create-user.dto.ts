import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  MinLength,
} from 'class-validator';
import * as userEntity from 'src/entities/user.entity';
import { RolesEnum } from 'src/entities/user.entity';

export class CreateUserDTO {
  
  @ApiProperty({example:'Alejandra Gutierrez', description:'Nombre completo del usuario'})
  @IsNotEmpty()
  name: string;

  @ApiProperty({example:'example@email.com', description:'Email valido del usuario'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({example:'123456', description:'La contraseña debe tener minimo 6 caracteres y máximo 10'})
  @IsNotEmpty()
  @Length(6, 10, { message: 'La contraseña debe tener entre 6 y 10 caracteres' })
  password: string;

  @ApiProperty({example:'27', description:'La edad del usuario debe ser mayor de edad' })
  @IsOptional()
  @IsInt()
  @Max(100, { message: 'La edad no debe ser mayor de 100' })
  age: number;

  @ApiProperty({example: '3124567890', description: 'Número de teléfono del usuario, mínimo 10 números' })
  @IsNotEmpty({ message: 'El numero es obligatoria' })
  @MinLength(10, { message: 'El numero de teléfono debe tener al menos 10 numeros', })
  phone: string;

  
  @ApiProperty({example: 'Calle 6 # 6-28', description: 'Dirección del usuario'})
  @IsNotEmpty({ message: 'La Direccion es obligatoria' })
  address: string;

  @ApiProperty({example:'admin', description:'Rol del usuario', required: false})
  @IsString()
  @IsOptional()
  role?: RolesEnum;

}
