import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentController } from './treatment.controller';
import { TreatmentService } from './treatment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { CreateTreatmentDTO } from 'src/dto/create-treatment.dto';
import { UpdateTreatmentDTO } from 'src/dto/update-treatment.dto';

describe('TreatmentController', () => {
  let controller: TreatmentController;
  let service: TreatmentService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    disable: jest.fn(),
  };

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
      controllers: [TreatmentController],
      providers: [{ provide: TreatmentService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<TreatmentController>(TreatmentController);
    service = module.get<TreatmentService>(TreatmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all treatments', async () => {
    const result = [{ id: 1, name: 'Therapy', status: true }];
    mockService.findAll.mockResolvedValue(result);

    const response = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(response).toEqual(result);
  });

  it('should return one treatment by id', async () => {
    const result = { id: 1, name: 'Therapy', status: true };
    mockService.findOne.mockResolvedValue(result);

    const response = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(response).toEqual(result);
  });

  it('should search treatments by name', async () => {
    const result = [{ id: 1, name: 'Massage' }];
    mockService.findByName.mockResolvedValue(result);

    const response = await controller.searchByName('Massage');

    expect(service.findByName).toHaveBeenCalledWith('Massage');
    expect(response).toEqual(result);
  });

  it('should create a new treatment', async () => {
    const dto: CreateTreatmentDTO = { name: 'New Treatment', description: 'Desc' } as any;
    const result = { id: 1, ...dto };
    mockService.create.mockResolvedValue(result);

    const response = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(response).toEqual(result);
  });

  it('should update a treatment', async () => {
    const dto: UpdateTreatmentDTO = { name: 'Updated' } as any;
    const result = { id: 1, ...dto };
    mockService.update.mockResolvedValue(result);

    const response = await controller.update('1', dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(response).toEqual(result);
  });

  it('should disable a treatment', async () => {
    const result = { message: 'Treatment disabled successfully' };
    mockService.disable.mockResolvedValue(result);

    const response = await controller.disable(1);

    expect(service.disable).toHaveBeenCalledWith(1);
    expect(response).toEqual(result);
  });
});
