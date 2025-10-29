import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClinicalHistoryDTO {

  @ApiProperty({ example: '2025-10-25', description: 'Fecha de la creación de la historia clinica'})
  @IsNotEmpty({ message: 'The date is required' })
  @IsString()
  date: string;
  
  @ApiProperty({ example: 'Dolor al comer', description: 'Motivo de la consulta'})
  @IsNotEmpty({ message: 'The reason for visit is required' })
  @IsString()
  reasonForVisit: string;
  
  @ApiProperty({ example: 'Caries', description: 'Diagnóstico de la historia clinica'})
  @IsNotEmpty({ message: 'The diagnosis is required' })
  @IsString()
  diagnosis: string;
  
  @ApiProperty({ example: 'Limpieza', description: 'Tratamiento para la historia clinica'})
  @IsOptional()
  @IsString()
  proposedTreatment?: string;
  
  @ApiProperty({ example: '1', description: 'ID del paciente vinculado a la historia clinica'})
  @IsNotEmpty({ message: 'A valid patient must be provided' })
  patientId: number;
}
