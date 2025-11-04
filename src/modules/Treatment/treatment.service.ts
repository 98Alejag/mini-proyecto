import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTreatmentDTO } from 'src/dto/create-treatment.dto';
import { UpdateTreatmentDTO } from 'src/dto/update-treatment.dto';
import { Treatment } from 'src/entities/treatment.entity';
import { ILike, Repository } from 'typeorm';


@Injectable()
export class TreatmentService {
  constructor(
    @InjectRepository(Treatment)
    private treatmentRepo: Repository<Treatment>,
  ) {}

  async findAll(): Promise<Treatment[]> {
    return this.treatmentRepo.find({ where: { status: true } });
  }
  async findOne(id: number) {
    const treatmentFind = this.treatmentRepo.findOneBy({ id });
    if (!treatmentFind)
      throw new NotFoundException(`Tratamiento con id ${id} no encontrado`);
    return treatmentFind;
  }
  async findByName(name: string): Promise<Treatment[]> {
    const treatments = await this.treatmentRepo.find({
      where: { name: ILike(`%${name}%`), status: true },
    });

    if (treatments.length === 0) {
      throw new NotFoundException(`No se encontraron tratamientos con el nombre: ${name}`);
    }

    return  treatments;
  }

  create(newTreatment: CreateTreatmentDTO) {
    const treatmentCreated = this.treatmentRepo.create(newTreatment);
    return this.treatmentRepo.save(treatmentCreated);
  }
  async update(id: number, updatedTreatment: UpdateTreatmentDTO) {
    await this.treatmentRepo.update(id, updatedTreatment);
    return this.treatmentRepo.findOneBy({ id });
  }
  async disable(id: number): Promise<{ message: string }> {
    const treatmentRemoved = await this.treatmentRepo.findOne({ where: { id } });
    if (!treatmentRemoved)
      throw new NotFoundException(`Tratamiento con id ${id} no encontrado`);
    treatmentRemoved.status = false;
    await this.treatmentRepo.save(treatmentRemoved);
    return { message: `Tratamiento con id ${id} deshabilitado exitosamente` }
  }
}
