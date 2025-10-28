import { IsIn } from 'class-validator';

export class UpdateStatusDTO {
  @IsIn(['pendiente', 'confirmada', 'cancelada'])
  status: 'pendiente' | 'confirmada' | 'cancelada';
}
