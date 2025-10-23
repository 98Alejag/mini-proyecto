
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/dto/Login.dto';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO } from 'src/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userCreated = this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
    await this.userRepo.save(userCreated);
    return {
      message: ' User created successfully',
      user: { id: userCreated.id, email: userCreated.email },
    };
  }

  async login(data: LoginDTO) {
    const user = await this.userRepo.findOne({ where: { email: data.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, name: user.name, email: user.email};
    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }
}
