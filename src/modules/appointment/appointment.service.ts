import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDTO } from 'src/dto/create-appoinment.dto';
import { Appointment } from 'src/entities/appointment.entity';
import { Treatment } from 'src/entities/treatment.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Treatment)
    private readonly treatmentRepo: Repository<Treatment>,
  ) {}

    async createAppointment(dto: CreateAppointmentDTO, currentUser: User, ): Promise<Appointment> {
    const start = new Date(dto.datehour);
    const hour = start.getHours();

    // Validar horario permitido
    const isValidHour = (hour >= 8 && hour < 12) || (hour >= 14 && hour < 18);
    if (!isValidHour) {
      throw new BadRequestException('La hora debe estar entre 8am-12pm o 2pm-6pm');
    }

    // Validar que el paciente sea el mismo si el usuario es paciente
    if (currentUser.role === 'patient' && dto.patientId !== currentUser.id) {
      throw new BadRequestException('No puedes agendar citas para otros pacientes');
    }

    // Validar solapamiento
    const end = new Date(start.getTime() + dto.durationMinutes * 60000);
    const overlapping = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.doctor = :doctorId', { doctorId: dto.doctorId })
      .andWhere('appointment.date < :end AND DATE_ADD(appointment.date, INTERVAL appointment.durationMinutes MINUTE) > :start', {
        start,
        end,
      })
      .getOne();

    if (overlapping) {
      throw new BadRequestException('El doctor ya tiene una cita en ese horario');
    }

    const doctor = await this.userRepo.findOne({ where: { id: dto.doctorId } });
    const patient = await this.userRepo.findOne({ where: { id: dto.patientId } });
    const treatment = await this.treatmentRepo.findOne({ where: { id: dto.treatmentId } });

    if (!doctor || !patient || !treatment) {
      throw new BadRequestException('Doctor, paciente o tratamiento no válido');
    }

    const appointment = this.appointmentRepo.create({
      datehour: dto.datehour,
      durationMinutes: dto.durationMinutes,
      doctor,
      patient,
      treatment,
      status: 'pendiente',
    });

    return this.appointmentRepo.save(appointment);



    }

}
