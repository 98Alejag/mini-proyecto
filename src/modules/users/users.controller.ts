import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
  @Get('search/:name')
  async searchByName(@Param('name') name: string): Promise<User[]> {
    return this.usersService.findByName(name);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
    return this.usersService.update(Number(id), body);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/disable')
  disable(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.disable(id);
  }
}
