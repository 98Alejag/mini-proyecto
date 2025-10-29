import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { LoginDTO } from 'src/dto/Login.dto';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { id: 1, email: 'user@test.com' };
      return true;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.register with correct data', async () => {
    const dto: CreateUserDTO = {
      email: 'test@mail.com',
      password: 'password123',
      name: 'Laura',
    } as CreateUserDTO;

    const result = { message: 'User created successfully', user: dto };
    mockAuthService.register.mockResolvedValue(result);

    const response = await controller.register(dto);

    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    expect(response).toEqual(result);
  });

  it('should call AuthService.login with correct data', async () => {
    const dto: LoginDTO = { email: 'test@mail.com', password: 'password123' };
    const result = { access_token: 'jwtToken123' };
    mockAuthService.login.mockResolvedValue(result);

    const response = await controller.login(dto);

    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    expect(response).toEqual(result);
  });

  it('should return user profile when authenticated', () => {
    const req = { user: { id: 1, email: 'user@test.com' } };
    const result = controller.getProfile(req);
    expect(result).toEqual(req.user);
  });
});
