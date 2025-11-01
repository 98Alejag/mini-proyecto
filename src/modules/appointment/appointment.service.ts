import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDTO } from 'src/dto/create-appoinment.dto';
import { UpdateAppointmentDTO } from 'src/dto/update-appointment.dto';
import { UpdateStatusDTO } from 'src/dto/update-status.dto';
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
  ): Promise<any> {
    const start = new Date(dto.datehour);
    const hour = start.getHours();

    // Validar horario permitido
    const isValidHour = (hour >= 8 && hour < 12) || (hour >= 14 && hour < 18);
    if (!isValidHour) {
      throw new BadRequestException(
        'La hora debe estar entre 8am-12pm o 2pm-6pm',
      );
    }

    // Validar rol que crea la cita
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
      .andWhere('appointment.status != :canceledStatus', { canceledStatus: 'cancelada' })
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
      doctor,
      patient,
      treatment,
      status: 'pendiente',
    });

    const saved = await this.appointmentRepo.save(appointment);

    // Solo devolver información filtrada
    return {
      id: saved.id,
      datehour: saved.datehour,
      durationMinutes: saved.durationMinutes,
      status: saved.status,
      doctor: { name: doctor.name },
      patient: {
        name: patient.name,
        age: patient.age,
        phone: patient.phone,
      },
      treatment: { id: treatment.id, name: treatment.name, price: treatment.price },
    };
  }

  async getAppointments(currentUser: User, status?: string): Promise<any[]> {
    const where: any = {};
    if (status) where.status = status;
    if (currentUser.role === 'patient') {
      where.patient = { id: currentUser.id };
    }

    const appointments = await this.appointmentRepo.find({
      where,
      relations: ['doctor', 'patient', 'treatment'],
      order: { datehour: 'ASC' },
      select: {
        id: true,
        datehour: true,
        durationMinutes: true,
        status: true,
        doctor: { name: true },
        patient: { name: true, age: true, phone: true },
        treatment: {  name: true, description: true, price: true },
      },
    });

    return appointments;
  }

   // Actualización general
  async updateAppointment(
    id: number,
    dto: UpdateAppointmentDTO,
    currentUser: User,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Cita no encontrada');

    //  Permisos
    const isPatientOwner = currentUser.role === 'patient' && appointment.patient.id === currentUser.id;
    const isDoctorOwner = currentUser.role === 'doctor' && appointment.doctor.id === currentUser.id;
    const isAdmin = currentUser.role === 'admin';

    if (!isAdmin && !isPatientOwner && !isDoctorOwner) {
      throw new BadRequestException('No tienes permiso para actualizar esta cita');
    }

    // Si se actualiza doctor, duración o fecha → validamos solapamiento
    const newDoctorId = dto.doctorId ?? appointment.doctor.id;
    const newDate = dto.datehour ? new Date(dto.datehour) : appointment.datehour;
    const newDuration = dto.durationMinutes ?? appointment.durationMinutes;
    const end = new Date(newDate.getTime() + newDuration * 60000);

    const overlapping = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.doctor = :doctorId', { doctorId: newDoctorId })
      .andWhere('appointment.status != :canceledStatus', { canceledStatus: 'cancelada' })
      .andWhere('appointment.datehour < :end')
      .andWhere(
        'DATE_ADD(appointment.datehour, INTERVAL appointment.durationMinutes MINUTE) > :start',
      )
      .andWhere('appointment.id != :id', { id })
      .setParameters({ start: newDate, end })
      .getOne();

    if (overlapping) {
      throw new BadRequestException('El doctor ya tiene una cita en ese horario');
    }

    // Aplicar cambios
    if (dto.datehour) appointment.datehour = newDate;
    if (dto.durationMinutes) appointment.durationMinutes = dto.durationMinutes;

    if (dto.doctorId && dto.doctorId !== appointment.doctor.id) {
      const doctor = await this.userRepo.findOne({ where: { id: dto.doctorId } });
      if (!doctor) throw new BadRequestException('Doctor no válido');
      appointment.doctor = doctor;
    }

    if (dto.patientId && dto.patientId !== appointment.patient.id) {
      const patient = await this.userRepo.findOne({ where: { id: dto.patientId } });
      if (!patient) throw new BadRequestException('Paciente no válido');
      appointment.patient = patient;
    }

    if (dto.treatmentId && dto.treatmentId !== appointment.treatment.id) {
      const treatment = await this.treatmentRepo.findOne({ where: { id: dto.treatmentId } });
      if (!treatment) throw new BadRequestException('Tratamiento no válido');
      appointment.treatment = treatment;
    }

    return this.appointmentRepo.save(appointment);}

  // Actualizar solo el estado
  async updateStatus(id: number, dto: UpdateStatusDTO, currentUser: User): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Cita no encontrada');

    // Permisos: solo admin o doctor puede cambiar el estado
    if (currentUser.role === 'patient') {
      throw new BadRequestException('No tienes permiso para modificar el estado');
    }

    if (!['pendiente', 'confirmada', 'cancelada'].includes(dto.status)) {
      throw new BadRequestException('Estado inválido');
    }

    appointment.status = dto.status;
    return this.appointmentRepo.save(appointment);
  }
}
