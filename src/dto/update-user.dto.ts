import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, Length, Max, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from 'src/entities/user.entity';

export class UpdateUserDTO {
  
  @ApiProperty({ example: 'patient', description: 'Estado del usuario', required: false })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ example: 'doctor', description: 'Rol del usuario', required: false })
  @IsOptional()
  role: RolesEnum;

  @ApiProperty({example:'Alejandra Gutierrez', description:'Nombre completo del usuario', required: false})
  @IsOptional()
  name?: string;

  @ApiProperty({example:'example@email.com', description:'Email valido del usuario', required: false})
  @IsOptional()
  @IsEmail()
  email?: string;
  
  @ApiProperty({example:'123456', description:'La contraseña debe tener minimo 6 caracteres y máximo 10', required: false})
  @IsOptional()
  @Length(6, 10, { message: 'La contraseña debe tener entre 6 y 10 caracteres' })
  password?: string;
  
  @ApiProperty({example:'27', description:'La edad del usuario', required: false })
  @IsOptional()
  @IsInt()
  @Max(100, { message: 'La edad no debe ser mayor de 100' })
  age?: number;
  
  @ApiProperty({example: '3124567890', description: 'Número de teléfono del usuario, mínimo 10 números', required: false })
  @IsNotEmpty({ message: 'El numero es obligatoria' })
  @MinLength(10, { message: 'El numero de teléfono debe tener al menos 10 numeros', })
  phone?: string;
     
  @ApiProperty({example: 'Calle 6 # 6-28', description: 'Dirección del usuario', required: false})
  @IsOptional()
  address?: string;
}
