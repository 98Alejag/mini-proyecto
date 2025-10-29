import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, MaxLength, IsOptional } from 'class-validator';

export class CreateTreatmentDTO {

    @ApiProperty({example: 'Ortodoncia', description: 'Nombre del tratamiento'})
    @IsNotEmpty({ message: 'El nombre del tratamiento es obligatorio' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres' })
    name: string;    
    
    
    @ApiProperty({example: 'Brackets', description: 'Descripción del tratamiento', required: false})
    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string;

    @ApiProperty({example: 50000, description: 'Precio del tratamiento'})
    @IsNotEmpty({ message: 'El precio es obligatorio' })
    @IsNumber({}, { message: 'El precio debe ser un número' })
    @Min(0, { message: 'El precio no puede ser negativo' })
    price: number;

}