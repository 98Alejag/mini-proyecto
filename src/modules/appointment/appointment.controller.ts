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

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor', 'patient')
  @Post()
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
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDTO,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentService.updateStatus(id, dto, currentUser);
  }
}
