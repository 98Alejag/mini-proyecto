import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { User } from 'src/entities/user.entity';
import { Treatment } from 'src/entities/treatment.entity';

// 🔹 Mock básico de dependencias
const mockAppointmentRepo = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  }),
  create: jest.fn(),
  save: jest.fn(),
});

const mockUserRepo = () => ({
  findOne: jest.fn(),
});

const mockTreatmentRepo = () => ({
  findOne: jest.fn(),
});

describe('AppointmentService', () => {
  let service: AppointmentService;
  let appointmentRepo: ReturnType<typeof mockAppointmentRepo>;
  let userRepo: ReturnType<typeof mockUserRepo>;
  let treatmentRepo: ReturnType<typeof mockTreatmentRepo>;

 const dto = {
  datehour: new Date('2025-10-10T15:00:00Z'), // ✅ equivale a 10:00am en UTC-5
  doctorId: 1,
  patientId: 2,
  treatmentId: 3,
};

  const mockDoctor = { id: 1, role: 'doctor', name: 'Dr. Smith' } as User;
  const mockPatient = { id: 2, role: 'patient', name: 'Laura' } as User;
  const mockTreatment = { id: 3, name: 'Limpieza dental' } as Treatment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: getRepositoryToken(Appointment), useFactory: mockAppointmentRepo },
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
        { provide: getRepositoryToken(Treatment), useFactory: mockTreatmentRepo },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    appointmentRepo = module.get(getRepositoryToken(Appointment));
    userRepo = module.get(getRepositoryToken(User));
    treatmentRepo = module.get(getRepositoryToken(Treatment));
  });

  it('should throw BadRequestException if time is invalid', async () => {
    const invalidDto = { ...dto, datehour: new Date('2025-10-10T23:00:00Z') };
    await expect(service.createAppointment(invalidDto as any, mockPatient)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if user has no permission', async () => {
    const user = { id: 3, role: 'patient' } as User;
    await expect(service.createAppointment(dto as any, user)).rejects.toThrow(BadRequestException);
  });

  it('should create an appointment successfully', async () => {
    appointmentRepo.createQueryBuilder().getOne.mockResolvedValueOnce(null);

    userRepo.findOne
      .mockResolvedValueOnce(mockDoctor)
      .mockResolvedValueOnce(mockPatient);
    treatmentRepo.findOne.mockResolvedValueOnce(mockTreatment);

    const mockCreated = {
      id: 1,
      datehour: dto.datehour,
      durationMinutes: dto.datehour,
      doctor: mockDoctor,
      patient: mockPatient,
      treatment: mockTreatment,
      status: 'pendiente',
    } as unknown as Appointment;

    appointmentRepo.create.mockReturnValue(mockCreated);
    appointmentRepo.save.mockResolvedValue(mockCreated);

    const result = await service.createAppointment(dto as any, { id: 5, role: 'admin' } as User);

    expect(result).toHaveProperty('id', 1);
    expect(result.status).toBe('pendiente');
    expect(appointmentRepo.save).toHaveBeenCalled();
  });
});
