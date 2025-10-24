import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import * as userEntity from "src/entities/user.entity"
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends CreateUserDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsNotEmpty()
  role: userEntity.Roles;
}
