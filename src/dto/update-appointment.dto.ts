import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAppointmentDTO {
  @ApiProperty({example: '2025-10-15T10:00:00Z', description: 'Fecha y hora de la cita en formato ISO 8601', required: false})
  @IsOptional()
  @IsDateString()
  datehour?: string;

  @ApiProperty({ example: '30', description: 'Duración de la cita en minutos', required: false })
  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @ApiProperty({ example: '1', description: 'ID del doctor asignado a la cita', required: false })
  @IsOptional()
  @IsNumber()
  doctorId?: number;

  @ApiProperty({ example: '1', description: 'ID del paciente asignado a la cita', required: false })
  @IsOptional()
  @IsNumber()
  patientId?: number;

  @ApiProperty({ example: '1', description: 'ID del tratamiento asignado a la cita', required: false })
  @IsOptional()
  @IsNumber()
  treatmentId?: number;
}
