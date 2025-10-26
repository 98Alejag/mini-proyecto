import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateAppointmentDTO } from 'src/dto/create-appoinment.dto';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('appointment')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor', 'patient')
  @Get()
  async getAppointments(
    @Query('status') status: string,
    @CurrentUser() user: User
  ) {
    if (status) {
      const validStatuses = ['pendiente', 'confirmada', 'cancelada'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
      }
      status = status.toLowerCase();
    }

    return this.appointmentService.getAppointments(user, status);
  }
}
