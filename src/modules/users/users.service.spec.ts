import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, RolesEnum } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'Laura' }] as User[];
      repo.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'Laura' } as User;
      repo.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const dto = { name: 'Laura', password: '1234', email: 'a@a.com' } as any;
      const hashed = await bcrypt.hash(dto.password, 10);
      const createdUser = { ...dto, password: hashed, id: 1 };

      repo.create.mockReturnValue(createdUser);
      repo.save.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith({
        ...dto,
        password: expect.any(String),
      });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual({ userCreated: createdUser });
    });
  });

  describe('update', () => {
    it('should update a user and return it', async () => {
      const dto = { name: 'Laura', password: '1234', role: 'ADMIN' } as any;
      const hashed = await bcrypt.hash(dto.password, 10);
      const updatedUser = { id: 1, ...dto, password: hashed } as User;

      repo.update.mockResolvedValue(undefined as any);
      repo.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(1, dto);

      expect(repo.update).toHaveBeenCalledWith(1, expect.objectContaining({
        password: expect.any(String),
        role: RolesEnum.ADMIN,
      }));
      expect(result).toEqual(updatedUser);
    });
  });

  describe('disable', () => {
    it('should disable a user successfully', async () => {
      const user = { id: 1, status: true } as User;
      repo.findOne.mockResolvedValue(user);
      repo.save.mockResolvedValue({ ...user, status: false });

      const result = await service.disable(1);

      expect(repo.save).toHaveBeenCalledWith({ ...user, status: false });
      expect(result.message).toContain('disable successfully');
    });

    it('should throw NotFoundException if user not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.disable(1)).rejects.toThrow(NotFoundException);
    });
  });
});
