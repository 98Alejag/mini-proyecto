import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { Treatment } from 'src/entities/treatment.entity';
import { CreateTreatmentDTO } from 'src/dto/create-treatment.dto';
import { UpdateTeatmentDTO } from 'src/dto/update-treatment.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('treatment')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @Get()
  findAll() {
    return this.treatmentService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treatmentService.findOne(Number(id));
  }
  @Get('search/:name')
  async searchByName(@Param('name') name: string): Promise<Treatment[]> {
    return this.treatmentService.findByName(name);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateTreatmentDTO) {
    return this.treatmentService.create(body);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateTeatmentDTO) {
    return this.treatmentService.update(Number(id), body);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/disable')
  disable(@Param('id', ParseIntPipe) id: number): Promise<{ message: string}> {
    return this.treatmentService.disable(id);
  }
}
