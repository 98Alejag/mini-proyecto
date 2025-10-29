import { IsBoolean, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { CreateTreatmentDTO } from './create-treatment.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTreatmentDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ example: 'Ortodoncia', description: 'Nombre del tratamiento' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres' })
  name: string;

  @ApiProperty({
    example: 'Brackets',
    description: 'Descripción del tratamiento',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 50000, description: 'Precio del tratamiento' })
  @IsOptional()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;
}
