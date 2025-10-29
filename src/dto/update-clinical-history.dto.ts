import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateClinicalHistoryDTO {
  @ApiProperty({ example: '2025-10-25', description: 'Fecha de la creación de la historia clinica', required: false})
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({ example: 'Dolor al comer', description: 'Motivo de la consulta', required: false})
  @IsOptional()
  @IsString()
  reasonForVisit?: string;

  @ApiProperty({ example: 'Caries', description: 'Diagnóstico de la historia clinica', required: false})
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ example: 'Limpieza', description: 'Tratamiento para la historia clinica', required: false})
  @IsOptional()
  @IsString()
  proposedTreatment?: string;
}
