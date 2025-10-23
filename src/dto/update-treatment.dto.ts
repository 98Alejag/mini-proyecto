import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTreatmentDTO } from './create-treatment.dto';

export class UpdateTeatmentDTO extends CreateTreatmentDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}