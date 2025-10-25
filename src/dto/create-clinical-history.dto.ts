import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClinicalHistoryDTO {
  @IsNotEmpty({ message: 'The date is required' })
  @IsString()
  date: string;

  @IsNotEmpty({ message: 'The reason for visit is required' })
  @IsString()
  reasonForVisit: string;

  @IsNotEmpty({ message: 'The diagnosis is required' })
  @IsString()
  diagnosis: string;

  @IsOptional()
  @IsString()
  proposedTreatment?: string;

  @IsNotEmpty({ message: 'A valid patient must be provided' })
  patientId: number;
}
