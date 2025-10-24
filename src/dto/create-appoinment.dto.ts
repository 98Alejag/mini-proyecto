import { IsDateString, IsNotEmpty, IsNumber} from 'class-validator';

export class CreateAppointmentDTO {
  @IsDateString()
  @IsNotEmpty()
  datehour: Date;

  @IsNumber()
  @IsNotEmpty()
  durationMinutes: number;

  @IsNumber()
  @IsNotEmpty()
  doctorId: number;

  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @IsNumber()
  @IsNotEmpty()
  treatmentId: number;
}
