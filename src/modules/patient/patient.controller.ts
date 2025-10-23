import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { Patient } from 'src/entities/patient.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';


@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * 🆕 Crea un nuevo paciente.
   * Ruta: POST /patients
   * @param patientData Datos del paciente enviados en el cuerpo (body).
   * @returns El paciente creado.
   */
  
  @Post()
  async create(@Body() patientData: Partial<Patient>): Promise<Patient> {
    return this.patientService.create(patientData);
  }

  /**
   * 📋 Obtiene todos los pacientes registrados.
   * Ruta: GET /patients
   * @returns Lista de pacientes.
   */
  @Get()
  async findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  /**
   * 🔍 Busca un paciente por su ID.
   * Ruta: GET /patients/:id
   * @param id ID del paciente (se convierte a número automáticamente).
   * @returns El paciente encontrado.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return this.patientService.findOne(id);
  }

  /**
   * 🔎 Busca pacientes por nombre (coincidencia parcial).
   * Ruta: GET /patients/search/:name
   * @param name Parte o nombre completo del paciente.
   * @returns Lista de pacientes que coinciden.
   */
  @Get('search/:name')
  async findByName(@Param('name') name: string): Promise<Patient[]> {
    return this.patientService.findByName(name);
  }

  /**
   * ✅ Obtiene todos los pacientes activos.
   * Ruta: GET /patients/active
   * @returns Lista de pacientes con estado activo.
   */
  @Get('status/active')
  async findActive(): Promise<Patient[]> {
    return this.patientService.findActive();
  }

  /**
   * ✏️ Actualiza parcialmente un paciente.
   * Ruta: PATCH /patients/:id
   * @param id ID del paciente a actualizar.
   * @param data Campos a modificar.
   * @returns El paciente actualizado.
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Patient>,
  ): Promise<Patient> {
    return this.patientService.update(id, data);
  }

  /**
   * 💤 Desactiva un paciente (eliminación lógica).
   * Ruta: PATCH /patients/:id/deactivate
   * @param id ID del paciente.
   * @returns El paciente con estado actualizado.
   */
  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return this.patientService.deactivate(id);
  }

  /**
   * ❌ Elimina un paciente de forma permanente.
   * Ruta: DELETE /patients/:id
   * @param id ID del paciente.
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.patientService.remove(id);
  }
}
