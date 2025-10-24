import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from 'src/entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Treatment } from 'src/entities/treatment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Treatment])],
  providers: [AppointmentService],
  controllers: [AppointmentController]
})
export class AppointmentModule {}
