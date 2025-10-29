import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalHistoryController } from './clinical-history.controller';
import { ClinicalHistoryService } from './clinical-history.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { CreateClinicalHistoryDTO } from 'src/dto/create-clinical-history.dto';
import { UpdateClinicalHistoryDTO } from 'src/dto/update-clinical-history.dto';

describe('ClinicalHistoryController', () => {
  let controller: ClinicalHistoryController;
  let service: ClinicalHistoryService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // 🛡️ Simulación de guards (JWT + Roles)
  const mockJwtAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { id: 1, role: 'doctor', email: 'test@clinic.com' };
      return true;
    },
  };

  const mockRolesGuard = {
    canActivate: () => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalHistoryController],
      providers: [{ provide: ClinicalHistoryService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<ClinicalHistoryController>(ClinicalHistoryController);
    service = module.get<ClinicalHistoryService>(ClinicalHistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create with correct data', async () => {
    const dto: CreateClinicalHistoryDTO = { patientId: 1, description: 'Healthy' } as any;
    const user = { id: 10, role: 'doctor' };
    const result = { id: 1, ...dto };

    mockService.create.mockResolvedValue(result);

    const response = await controller.create(dto, { user });

    expect(mockService.create).toHaveBeenCalledWith(dto, user);
    expect(response).toEqual(result);
  });

  it('should call service.findAll and return data', async () => {
    const user = { id: 10, role: 'doctor' };
    const result = [{ id: 1, description: 'Exam 1' }];

    mockService.findAll.mockResolvedValue(result);

    const response = await controller.findAll({ user });

    expect(mockService.findAll).toHaveBeenCalledWith(user);
    expect(response).toEqual(result);
  });

  it('should call service.findOne with correct ID', async () => {
    const user = { id: 10, role: 'doctor' };
    const result = { id: 1, description: 'Exam' };

    mockService.findOne.mockResolvedValue(result);

    const response = await controller.findOne(1, { user });

    expect(mockService.findOne).toHaveBeenCalledWith(1, user);
    expect(response).toEqual(result);
  });

  it('should call service.update correctly', async () => {
    const user = { id: 10, role: 'doctor' };
    const dto: UpdateClinicalHistoryDTO = { description: 'Updated' } as any;
    const result = { id: 1, ...dto };

    mockService.update.mockResolvedValue(result);

    const response = await controller.update(1, dto, { user });

    expect(mockService.update).toHaveBeenCalledWith(1, dto, user);
    expect(response).toEqual(result);
  });

  it('should call service.remove correctly', async () => {
    const user = { id: 10, role: 'doctor' };
    const result = { message: 'Deleted successfully' };

    mockService.remove.mockResolvedValue(result);

    const response = await controller.remove(1, { user });

    expect(mockService.remove).toHaveBeenCalledWith(1, user);
    expect(response).toEqual(result);
  });
});
