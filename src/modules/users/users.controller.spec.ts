import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    name: 'Laura',
    email: 'laura@test.com',
    password: 'hashedpass',
    phone: '3124567890',
    address: 'Calle 123',
    age: 25,
  };

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findByName: jest.fn().mockResolvedValue([mockUser]),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ ...mockUser, name: 'Laura Updated' }),
    disable: jest.fn().mockResolvedValue({ message: 'User disabled' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a user by ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should search users by name', async () => {
    const result = await controller.searchByName('Laura');
    expect(result).toEqual([mockUser]);
    expect(service.findByName).toHaveBeenCalledWith('Laura');
  });

  it('should create a new user', async () => {
    const dto: CreateUserDTO = {
      name: 'Laura',
      email: 'laura@test.com',
      password: '123456',
      age: 25,
      phone: '3124567890',
      address: 'Calle 123',
    };

    const result = await controller.create(dto);
    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDTO = {
      name: 'Laura Updated',
      email: 'laura@test.com',
      password: 'newpass',
      age: 25,
      phone: '3124567890',
      address: 'Calle 123',
      role: 'doctor',
    };

    const result = await controller.update(1, dto);
    expect(result).toEqual({ ...mockUser, name: 'Laura Updated' });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should disable a user', async () => {
    const result = await controller.disable(1);
    expect(result).toEqual({ message: 'User disabled' });
    expect(service.disable).toHaveBeenCalledWith(1);
  });
});
