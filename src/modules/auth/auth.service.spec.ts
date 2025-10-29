// ✅ src/modules/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should hash password and register user successfully', async () => {
    const dto = { email: 'test@mail.com', password: '12345' } as any;
    const hashedPassword = 'hashedPass123';
    const savedUser = { id: 1, email: dto.email } as User;

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    jest.spyOn(userRepo, 'create').mockReturnValue({ ...dto, password: hashedPassword } as any);
    jest.spyOn(userRepo, 'save').mockResolvedValue(savedUser as any);

    const result = await service.register(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);

    // ✅ Validamos sin depender del espacio o id exacto
    expect(result.message).toMatch(/User created successfully/i);
    expect(result.user).toEqual(expect.objectContaining({ email: dto.email }));
  });

  it('should return JWT token if credentials are valid', async () => {
    const dto = { email: 'test@mail.com', password: '12345' } as any;
    const user = { id: 1, email: dto.email, password: 'hashed' } as User;

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwtToken123' as never);

    const result = await service.login(dto);
    expect(result).toEqual({ accessToken: 'jwtToken123' });
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const dto = { email: 'test@mail.com', password: 'wrong' } as any;
    const user = { id: 1, email: dto.email, password: 'hashed' } as User;

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
  });
});
