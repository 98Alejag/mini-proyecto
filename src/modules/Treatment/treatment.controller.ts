import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { Treatment } from 'src/entities/treatment.entity';
import { CreateTreatmentDTO } from 'src/dto/create-treatment.dto';
import { UpdateTreatmentDTO } from 'src/dto/update-treatment.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Treatments')
@Controller('/api/treatment')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @Get()
  @ApiOperation({ summary: 'Trae todos los tratamientos de la BD'})
  @ApiResponse({ status: 200, description: 'Lista todos los tratamientos de la BD'})
  findAll() {
    return this.treatmentService.findAll();
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Trae un tratamiento por ID de la BD'})
  @ApiResponse({ status: 200, description: 'Devuelve un tratamiento de la BD'})
  @ApiResponse({ status: 404, description: 'No se encontró el tratamiento en la BD'})
  findOne(@Param('id', ParseIntPipe) id: number ) {
    return this.treatmentService.findOne(id);
  }
  
  @Get('search/:name')
  @ApiOperation({ summary: 'Trae un tratamiento por nombre de la BD'})
  @ApiResponse({ status: 200, description: 'Devuelve el/los tratamiento(s) de la BD'})
  @ApiResponse({ status: 404, description: 'No se encontró un tratamiento en la BD'})
  async searchByName(@Param('name') name: string): Promise<Treatment[]> {
    return this.treatmentService.findByName(name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  @Post()
  @Post()
  @ApiBearerAuth()
  @ApiOperation({summary: 'Crear un nuevo tratamiento'})
  @ApiResponse({status:201, description:'tratamiento creado exitosamente en DB' })
  create(@Body() body: CreateTreatmentDTO) {
    return this.treatmentService.create(body);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Actualizar un tratamiento existente'})
  @ApiResponse({status:201, description:'Tratamiento actualizado exitosamente en DB' })
  update(@Param('id') id: string, @Body() body: UpdateTreatmentDTO) {
    return this.treatmentService.update(Number(id), body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  @Patch(':id/disable')
  @ApiBearerAuth()
  @ApiOperation({summary: 'Inactiva un tratamiento existente'})
  @ApiResponse({status:200, description: 'Tratamiento inactivado exitosamente en la DB'})
  @ApiResponse({status:404, description: 'Tratamiento no encontrado en la DB'})
  disable(@Param('id', ParseIntPipe) id: number): Promise<{ message: string}> {
    return this.treatmentService.disable(id);
  }
}
