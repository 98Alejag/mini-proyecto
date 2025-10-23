import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePatientDTO } from './create-patient.dto';

export class UpdatePatientDTO extends CreatePatientDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}