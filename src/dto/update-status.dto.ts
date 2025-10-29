import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

// DTO para actualizar el estado de un tratamiento
export class UpdateStatusDTO {
  
  @ApiProperty({example: 'confirmada', description:'Estado de la cita: pendiente, confirmada o cancelada'})
  @IsIn(['pendiente', 'confirmada', 'cancelada'])
  status: 'pendiente' | 'confirmada' | 'cancelada';
}
