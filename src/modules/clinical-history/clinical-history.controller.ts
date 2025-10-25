import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ClinicalHistoryService } from './clinical-history.service';
import { CreateClinicalHistoryDTO } from 'src/dto/create-clinical-history.dto';
import { UpdateClinicalHistoryDTO } from 'src/dto/update-clinical-history.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('clinical-history')
@UseGuards(JwtAuthGuard, RolesGuard) // 🔒 Protege todas las rutas con JWT y validación de roles
export class ClinicalHistoryController {
  constructor(private readonly clinicalHistoryService: ClinicalHistoryService) {}

  /**
   * 🩺 Crea una nueva historia clínica.
   * Solo accesible para usuarios con rol de "doctor".
   */
  @Post()
  @Roles('doctor')
  create(
    @Body() dto: CreateClinicalHistoryDTO,
    @Request() req: any, // contiene el usuario autenticado (req.user)
  ) {
    return this.clinicalHistoryService.create(dto, req.user);
  }

  /**
   * 📋 Obtiene todas las historias clínicas del sistema.
   * Solo los doctores pueden verlas.
   */
  @Get()
  @Roles('doctor')
  findAll(@Request() req: any) {
    return this.clinicalHistoryService.findAll(req.user);
  }

  /**
   * 🔍 Obtiene una historia clínica específica por ID.
   * - Un doctor puede acceder a cualquier historia.
   * - Un paciente solo puede ver la suya propia.
   */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.clinicalHistoryService.findOne(id, req.user);
  }

  /**
   * ✏️ Actualiza una historia clínica existente.
   * Solo los doctores pueden modificarla.
   */
  @Patch(':id')
  @Roles('doctor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClinicalHistoryDTO,
    @Request() req: any,
  ) {
    return this.clinicalHistoryService.update(id, dto, req.user);
  }

  /**
   * ❌ Elimina una historia clínica.
   * Solo los doctores pueden hacerlo.
   */
  @Delete(':id')
  @Roles('doctor')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.clinicalHistoryService.remove(id, req.user);
  }
}
