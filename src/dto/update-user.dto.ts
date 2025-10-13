import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends CreateUserDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
