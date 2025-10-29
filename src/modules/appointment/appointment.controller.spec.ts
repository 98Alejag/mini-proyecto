import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDTO } from 'src/dto/create-appoinment.dto';
import { UpdateAppointmentDTO } from 'src/dto/update-appointment.dto';
import { UpdateStatusDTO } from 'src/dto/update-status.dto';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let service: AppointmentService;

  const mockAppointmentService = {
    createAppointment: jest.fn((dto, user) => ({ id: 1, ...dto, user })),
    getAppointments: jest.fn((user, status) => [{ id: 1, status, user }]),
    updateAppointment: jest.fn((id, dto, user) => ({ id, ...dto, user })),
    updateStatus: jest.fn((id, dto, user) => ({ id, status: dto.status })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        {
          provide: AppointmentService,
          useValue: mockAppointmentService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should create an appointment', async () => {
      const dto: CreateAppointmentDTO = { date: '2025-10-30', description: 'Test' } as any;
      const user = { id: 1, name: 'Test User' } as any;
      expect(await controller.createAppointment(dto, user)).toEqual({
        id: 1,
        ...dto,
        user,
      });
      expect(service.createAppointment).toHaveBeenCalledWith(dto, user);
    });
  });

  describe('getAppointments', () => {
    it('should return all appointments', async () => {
      const user = { id: 1 } as any;
      const status = 'confirmada';
      expect(await controller.getAppointments(user, status)).toEqual([
        { id: 1, status, user },
      ]);
      expect(service.getAppointments).toHaveBeenCalledWith(user, status);
    });
  });

  describe('updateAppointment', () => {
    it('should update an appointment', async () => {
      const dto: UpdateAppointmentDTO = { description: 'Updated' } as any;
      const user = { id: 1 } as any;
      expect(await controller.updateAppointment(1, dto, user)).toEqual({
        id: 1,
        ...dto,
        user,
      });
      expect(service.updateAppointment).toHaveBeenCalledWith(1, dto, user);
    });
  });

  describe('updateStatus', () => {
    it('should update appointment status', async () => {
      const dto: UpdateStatusDTO = { status: 'cancelada' };
      const user = { id: 1 } as any;
      expect(await controller.updateStatus(1, dto, user)).toEqual({
        id: 1,
        status: dto.status,
      });
      expect(service.updateStatus).toHaveBeenCalledWith(1, dto, user);
    });
  });
});
