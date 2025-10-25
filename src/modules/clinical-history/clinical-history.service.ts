import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClinicalHistoryDTO } from 'src/dto/create-clinical-history.dto';
import { UpdateClinicalHistoryDTO } from 'src/dto/update-clinical-history.dto';
import { ClinicalHistory } from 'src/entities/clinical-history.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ClinicalHistoryService {
  constructor(
    @InjectRepository(ClinicalHistory)
    private readonly historyRepository: Repository<ClinicalHistory>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 🩺 Crea una nueva historia clínica asociada a un paciente.
   * Solo los usuarios con rol de "doctor" pueden realizar esta acción.
   *
   * @param dto Datos de la historia clínica (CreateClinicalHistoryDTO)
   * @param user Usuario autenticado (con rol verificado)
   * @returns La historia clínica creada
   */
  async create(dto: CreateClinicalHistoryDTO, user: User) {
    // Verificar que el usuario tenga rol "doctor"
    if (user.role !== 'doctor') {
      throw new ForbiddenException('Solo los doctores pueden crear historias clínicas');
    }

    // Buscar el paciente en la base de datos
    const patient = await this.userRepository.findOneBy({ id: dto.patientId });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // Crear y guardar la historia clínica
    const history = this.historyRepository.create({
      ...dto,
      patient,
    });

    return this.historyRepository.save(history);
  }

  /**
   * 📋 Obtiene todas las historias clínicas registradas.
   * Solo accesible para doctores.
   */
  async findAll(user: User) {
    if (user.role !== 'doctor') {
      throw new ForbiddenException('Solo los doctores pueden ver todas las historias clínicas');
    }

    return this.historyRepository.find({
      relations: ['patient'],
    });
  }

  /**
   * 🔍 Busca una historia clínica por su ID.
   * - Un doctor puede consultar cualquier historia.
   * - Un paciente solo puede consultar la suya.
   */
  async findOne(id: number, user: User) {
    const history = await this.historyRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!history) {
      throw new NotFoundException('Historia clínica no encontrada');
    }

    // Validar permisos
    if (user.role === 'patient' && user.id !== history.patient.id) {
      throw new ForbiddenException('No tienes permiso para ver esta historia clínica');
    }

    return history;
  }

  /**
   * ✏️ Actualiza una historia clínica.
   * Solo el doctor puede modificarla.
   */
  async update(id: number, dto: UpdateClinicalHistoryDTO, user: User) {
    if (user.role !== 'doctor') {
      throw new ForbiddenException('Solo los doctores pueden actualizar historias clínicas');
    }

    const history = await this.findOne(id, user);
    Object.assign(history, dto);

    return this.historyRepository.save(history);
  }

  /**
   * ❌ Elimina una historia clínica.
   * Solo los doctores pueden realizar esta acción.
   */
  async remove(id: number, user: User) {
    if (user.role !== 'doctor') {
      throw new ForbiddenException('Solo los doctores pueden eliminar historias clínicas');
    }

    const history = await this.findOne(id, user);
    return this.historyRepository.remove(history);
  }
}
