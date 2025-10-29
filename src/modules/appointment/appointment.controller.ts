import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateAppointmentDTO } from 'src/dto/create-appoinment.dto';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateAppointmentDTO } from 'src/dto/update-appointment.dto';
import { UpdateStatusDTO } from 'src/dto/update-status.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('/api/appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor', 'patient')
  @Post()
  @ApiOperation({ summary: 'Crea una nueva cita' })
  @ApiResponse({ status: 201, description: 'Cita creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  async createAppointment(
    @Body() dto: CreateAppointmentDTO,
    @CurrentUser() user: User,
  ) {
    return this.appointmentService.createAppointment(dto, user);
  }
//http://localhost:3001/appointments || http://localhost:3001/appointments?status=confirmada 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor', 'patient')
   @Get()
   @ApiOperation({ summary: 'Obtiene las todas citas, opcionalmente filtradas por estado o por paciente' })
   @ApiResponse({ status: 200, description: 'Citas obtenidas exitosamente.' })
   @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado de la cita (por ejemplo: confirmada, cancelada, pendiente)'})
  async getAppointments(
    @CurrentUser() currentUser: User,
    @Query('status') status?: string,
  ) {
    return this.appointmentService.getAppointments(currentUser, status);
  }
  //http://localhost:3001/appointments/1
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor', 'patient')
  @Put(':id')
  @ApiOperation({ summary: 'Actuliza una cita existente'})
  @ApiResponse({ status: 200, description: 'Cita actualizada correctamente en la BD'})
  @ApiResponse({ status: 404, description: 'Cita no encontrada en la BD'})
  @ApiResponse({ status: 400, description: 'No tienes permisos para actualizar esta cita'})
  async updateAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDTO,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentService.updateAppointment(id, dto, currentUser);
  }
  //http://localhost:3001/appointments/2/status
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Actuliza el estado de una cita existente'})
  @ApiResponse({ status: 200, description: 'Estado modificado correctamente en la BD'})
  @ApiResponse({ status: 400, description: 'No tienes permisos para actualizar el estado de esta cita'})
  @ApiResponse({ status: 404, description: 'Cita no encontrada en la BD'})
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDTO,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentService.updateStatus(id, dto, currentUser);
  }
}
