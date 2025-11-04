import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClinicalHistoryDTO {

  @ApiProperty({ example: '2025-10-25', description: 'Fecha de la creación de la historia clinica'})
  @IsNotEmpty({ message: 'Fecha requerida' })
  @IsString()
  date: string;
  
  @ApiProperty({ example: 'Dolor al comer', description: 'Motivo de la consulta'})
  @IsNotEmpty({ message: 'Motivo de la consulta requerido' })
  @IsString()
  reasonForVisit: string;
  
  @ApiProperty({ example: 'Caries', description: 'Diagnóstico de la historia clinica'})
  @IsNotEmpty({ message: 'El diagnóstico es requerido' })
  @IsString()
  diagnosis: string;
  
  @ApiProperty({ example: 'Limpieza', description: 'Tratamiento para la historia clinica'})
  @IsOptional()
  @IsString()
  proposedTreatment?: string;
  
  @ApiProperty({ example: '1', description: 'ID del paciente vinculado a la historia clinica'})
  @IsNotEmpty({ message: 'Se debe proporcionar un paciente válido' })
  patientId: number;
}
