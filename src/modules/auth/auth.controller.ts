import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/dto/Login.dto';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { JwtAuthGuard } from './jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({summary: 'Registra un usuario'})
    @ApiResponse({status: 200, description: 'Usuario registrado con exito en la base de datos y nos devuelve el usuario'})
    register(@Body() data: CreateUserDTO) {
        return this.authService.register(data);
    }

    @Post('login')
    @ApiOperation({summary: 'Inicia sesión de un usuario'})
    @ApiResponse({status: 200, description: 'Usuario logueado con exito y nos devuelve el token de acceso'})
    @ApiResponse({status: 401, description: 'Credenciales invalidas'})
    login(@Body() data: LoginDTO) {
        return this.authService.login(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Obtiene el perfil del usuario que esta loggeado'})
    @ApiResponse({status: 200, description: 'Información del usuario'})
    getProfile(@Request() req) {
        return req.user;
    }
}   