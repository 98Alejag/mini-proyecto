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
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({summary: 'Obtener todos los ususarios'})
  @ApiResponse({status:200, description:'Lista de usuarios retornados desde la DB' })
    
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Obtiene el usuario por ID'})
  @ApiResponse({status:200, description:'Usuario encontrado desde DB' })
  @ApiResponse({status:400, description:'Usuario no encontrado en la DB' })
  findOne(@Param('id', ParseIntPipe ) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('search/:name')
  @ApiOperation({summary: 'Obtiene el/los usuario(s) encontrados por nombre en la DB'})
  @ApiResponse({status:200, description:'Usuario(s) encontrado(s) desde DB' })
  @ApiResponse({status:400, description:'Usuario(s) no encontrado(s) en la DB' })
  async searchByName(@Param('name') name: string): Promise<User[]> {
    return this.usersService.findByName(name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({summary: 'Crear un nuevo usuario'})
  @ApiResponse({status:201, description:'Usuario creado exitosamente en DB' })
  create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Actualizar un usuario existente'})
  @ApiResponse({status:200, description:'Usuario actualizado en exitosamente en DB' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
    return this.usersService.update(Number(id), body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  @Patch(':id/disable')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Inactiva un usuario existente'})
  @ApiResponse({status:200, description: 'usuario inactivado exitosamente en la DB'})
  @ApiResponse({status:404, description: 'usuario no encontrado en la DB'})
  disable(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.disable(id);
  }
}
