import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalHistoryService } from './clinical-history.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClinicalHistory } from 'src/entities/clinical-history.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ClinicalHistoryService', () => {
  let service: ClinicalHistoryService;
  let userRepo: Repository<User>;
  let historyRepo: Repository<ClinicalHistory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicalHistoryService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn(), findOneBy: jest.fn() }, // ✅ agregado
        },
        {
          provide: getRepositoryToken(ClinicalHistory),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ClinicalHistoryService>(ClinicalHistoryService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    historyRepo = module.get<Repository<ClinicalHistory>>(getRepositoryToken(ClinicalHistory));
  });

  it('should throw ForbiddenException if user is not a doctor', async () => {
    const dto = { userId: 2, diagnosis: 'test diagnosis' };
    const mockUser = { id: 1, name: 'Normal User', role: 'patient' } as User;

    await expect(service.create(dto as any, mockUser)).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if target user (patient) does not exist', async () => {
    const dto = { userId: 999, diagnosis: 'test diagnosis' };
    const mockUser = { id: 1, name: 'Doctor Test', role: 'doctor' } as User;

    jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

    await expect(service.create(dto as any, mockUser)).rejects.toThrow(NotFoundException);
  });
});
