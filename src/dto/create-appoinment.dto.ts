import { IsDateString, IsNotEmpty, IsNumber} from 'class-validator';

export class CreateAppoinmentDTO {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

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
