import { IsNotEmpty, IsNumber, IsString, Min, MaxLength, IsOptional } from 'class-validator';

export class CreateTreatmentDTO {

    @IsNotEmpty({ message: 'El nombre del tratamiento es obligatorio' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres' })
    name: string;    

    
    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string;

    @IsNotEmpty({ message: 'El precio es obligatorio' })
    @IsNumber({}, { message: 'El precio debe ser un número' })
    @Min(0, { message: 'El precio no puede ser negativo' })
    price: number;

}