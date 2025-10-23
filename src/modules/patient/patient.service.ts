import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Patient } from 'src/entities/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  /**
   * 🆕 Crea un nuevo registro de paciente en la base de datos.
   * @param patientData Datos parciales del paciente a registrar.
   * @returns El paciente creado.
   */
  async create(patientData: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create(patientData);
    return this.patientRepository.save(patient);
  }

  /**
   * 📋 Obtiene todos los pacientes registrados en la base de datos.
   * @returns Lista completa de pacientes.
   */
  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  /**
   * 🔍 Busca un paciente por su identificador único (ID).
   * Si el paciente no existe, lanza una excepción.
   * @param id Identificador del paciente.
   * @returns El paciente encontrado.
   * @throws NotFoundException si el paciente no existe.
   */
  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  /**
   * 🔎 Busca pacientes por nombre (coincidencia parcial).
   * Permite búsquedas más flexibles o autocompletado.
   * @param name Nombre o parte del nombre del paciente.
   * @returns Lista de pacientes que coinciden con el nombre ingresado.
   */
  async findByName(name: string): Promise<Patient[]> {
    return this.patientRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  /**
   * ✅ Obtiene todos los pacientes activos (status = true).
   * @returns Lista de pacientes activos.
   */
  async findActive(): Promise<Patient[]> {
    return this.patientRepository.find({ where: { status: true } });
  }

  /**
   * ✏️ Actualiza parcialmente los datos de un paciente.
   * Solo modifica los campos enviados en el objeto `data`.
   * @param id Identificador del paciente.
   * @param data Campos a actualizar.
   * @returns El paciente actualizado.
   */
  async update(id: number, data: Partial<Patient>): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, data);
    return this.patientRepository.save(patient);
  }

  /**
   * 💤 Desactiva un paciente (eliminación lógica).
   * No borra el registro, solo cambia su estado a inactivo.
   * @param id Identificador del paciente.
   * @returns El paciente con el estado actualizado.
   */
  async deactivate(id: number): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.status = false;
    return this.patientRepository.save(patient);
  }

  /**
   * ❌ Elimina un paciente de manera permanente.
   * ⚠️ Esta acción no se puede deshacer.
   * @param id Identificador del paciente.
   */
  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
  }
}
