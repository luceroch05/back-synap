import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participante } from './entities/participante.entity';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';

/**
 * Servicio de Participantes
 * Gestión de participantes del sistema
 */
@Injectable()
export class ParticipantesService {
  constructor(
    @InjectRepository(Participante)
    private readonly participanteRepository: Repository<Participante>,
  ) {}

  /**
   * Crear un nuevo participante
   */
  async create(
    createDto: CreateParticipanteDto,
    userId: number,
  ): Promise<Participante> {
    // Verificar duplicado por documento
    const existente = await this.participanteRepository.findOne({
      where: {
        tipoDocumento: createDto.tipoDocumento,
        numeroDocumento: createDto.numeroDocumento,
      },
    });

    if (existente) {
      throw new ConflictException(
        `Ya existe un participante con ${createDto.tipoDocumento} ${createDto.numeroDocumento}`,
      );
    }

    const participante = this.participanteRepository.create({
      ...createDto,
      userCreaId: userId,
    });

    return await this.participanteRepository.save(participante);
  }

  /**
   * Listar todos los participantes
   */
  async findAll(): Promise<Participante[]> {
    return await this.participanteRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Listar solo participantes activos
   */
  async findAllActive(): Promise<Participante[]> {
    return await this.participanteRepository.find({
      where: { activo: true },
      order: { nombres: 'ASC', apellidos: 'ASC' },
    });
  }

  /**
   * Obtener un participante por ID
   */
  async findOne(id: number): Promise<Participante> {
    const participante = await this.participanteRepository.findOne({
      where: { id },
      relations: ['userCrea', 'userActualiza'],
    });

    if (!participante) {
      throw new NotFoundException(`Participante con ID ${id} no encontrado`);
    }

    return participante;
  }

  /**
   * Buscar por documento
   */
  async findByDocumento(
    tipoDocumento: string,
    numeroDocumento: string,
  ): Promise<Participante | null> {
    return await this.participanteRepository.findOne({
      where: { tipoDocumento, numeroDocumento },
    });
  }

  /**
   * Actualizar un participante
   */
  async update(
    id: number,
    updateDto: UpdateParticipanteDto,
    userId: number,
  ): Promise<Participante> {
    const participante = await this.findOne(id);

    // Verificar duplicado si se cambia el documento
    if (
      updateDto.tipoDocumento &&
      updateDto.numeroDocumento &&
      (updateDto.tipoDocumento !== participante.tipoDocumento ||
        updateDto.numeroDocumento !== participante.numeroDocumento)
    ) {
      const existente = await this.findByDocumento(
        updateDto.tipoDocumento,
        updateDto.numeroDocumento,
      );

      if (existente) {
        throw new ConflictException(
          `Ya existe un participante con ${updateDto.tipoDocumento} ${updateDto.numeroDocumento}`,
        );
      }
    }

    Object.assign(participante, updateDto);
    participante.userActualizaId = userId;

    return await this.participanteRepository.save(participante);
  }

  /**
   * Eliminar un participante
   */
  async remove(id: number): Promise<void> {
    const participante = await this.findOne(id);
    await this.participanteRepository.remove(participante);
  }

  /**
   * Activar/Desactivar un participante
   */
  async toggleActive(id: number, userId: number): Promise<Participante> {
    const participante = await this.findOne(id);
    participante.activo = !participante.activo;
    participante.userActualizaId = userId;
    return await this.participanteRepository.save(participante);
  }
}
