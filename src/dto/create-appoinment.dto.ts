import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppointmentDTO {

  @ApiProperty({ example: '2025-10-15T10:00:00Z', description: 'Fecha y hora de la cita en formato ISO 8601' })
  @IsDateString()
  @IsNotEmpty()
  datehour: string;
  
  @ApiProperty({ example: '30', description: 'Duración de la cita en minutos' })
  @IsNumber()
  @IsNotEmpty()
  durationMinutes: number;
  
  @ApiProperty({ example: '1', description: 'ID del doctor asignado a la cita' })
  @IsNumber()
  @IsNotEmpty()
  doctorId: number;
  
  @ApiProperty({ example: '1', description: 'ID del paciente asignado a la cita' })
  @IsNumber()
  @IsNotEmpty()
  patientId: number;
  
  @ApiProperty({ example: '1', description: 'ID del tratamiento asignado a la cita' })
  @IsNumber()
  @IsNotEmpty()
  treatmentId: number;
}
