import { IsOptional, IsString } from 'class-validator';

export class UpdateClinicalHistoryDTO {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  reasonForVisit?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  proposedTreatment?: string;
}
