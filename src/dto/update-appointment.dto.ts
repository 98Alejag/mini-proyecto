import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAppointmentDTO {
  @IsOptional()
  @IsDateString()
  datehour?: string;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @IsOptional()
  @IsNumber()
  doctorId?: number;

  @IsOptional()
  @IsNumber()
  patientId?: number;

  @IsOptional()
  @IsNumber()
  treatmentId?: number;
}
