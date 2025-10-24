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

  async createAppointment(
    dto: CreateAppointmentDTO,
    currentUser: User,
  ): Promise<Appointment> {
    const start = new Date(dto.datehour);
    const hour = start.getHours();

    // Validar horario permitido
    const isValidHour = (hour >= 8 && hour < 12) || (hour >= 14 && hour < 18);
    if (!isValidHour) {
      throw new BadRequestException(
        'La hora debe estar entre 8am-12pm o 2pm-6pm',
      );
    }
    // Validacion del rol que esta creando la cita
    const isPatientCreatingForSelf =
      currentUser.role === 'patient' && dto.patientId === currentUser.id;

    const isDoctorOrAdmin =
      currentUser.role === 'doctor' || currentUser.role === 'admin';

    if (!isPatientCreatingForSelf && !isDoctorOrAdmin) {
      throw new BadRequestException('No tienes permiso para agendar esta cita');
    }

    // Validar solapamiento
    const end = new Date(start.getTime() + dto.durationMinutes * 60000);
    const overlapping = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.doctor = :doctorId', { doctorId: dto.doctorId })
      .andWhere('appointment.datehour < :end')
      .andWhere(
        'DATE_ADD(appointment.datehour, INTERVAL appointment.durationMinutes MINUTE) > :start',
      )
      .setParameters({ start, end })
      .getOne();

    if (overlapping) {
      throw new BadRequestException(
        'El doctor ya tiene una cita en ese horario',
      );
    }

    const doctor = await this.userRepo.findOne({ where: { id: dto.doctorId } });
    const patient = await this.userRepo.findOne({
      where: { id: dto.patientId },
    });
    const treatment = await this.treatmentRepo.findOne({
      where: { id: dto.treatmentId },
    });

    if (!doctor || !patient || !treatment) {
      throw new BadRequestException('Doctor, paciente o tratamiento no válido');
    }

    const appointment = this.appointmentRepo.create({
      datehour: dto.datehour,
      durationMinutes: dto.durationMinutes,
      doctor: {
        id: doctor.id,
        name: doctor.name,
      },
      patient: {
        id: patient.id,
        name: patient.name,
      },
      treatment,
      status: 'pendiente',
    });

    return this.appointmentRepo.save(appointment);
  }

  async getAppointments(currentUser: User): Promise<Appointment[]> {
  if (currentUser.role === 'patient') {
    return this.appointmentRepo.find({
      where: { patient: { id: currentUser.id } },
      order: { datehour: 'ASC' },
    });
  }

  // Admin y doctor ven todas
  return this.appointmentRepo.find({
    order: { datehour: 'ASC' },
  });
}

}
