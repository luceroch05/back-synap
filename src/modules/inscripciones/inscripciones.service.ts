import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';

/**
 * Servicio de Inscripciones
 */
@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private inscripcionRepository: Repository<Inscripcion>,
  ) {}

  /**
   * Crear una nueva inscripción
   */
  async create(
    createDto: CreateInscripcionDto,
    userId: number,
  ): Promise<Inscripcion> {
    // Verificar si ya existe una inscripción para este participante en este grupo
    const existe = await this.inscripcionRepository.findOne({
      where: {
        participanteId: createDto.participanteId,
        grupoId: createDto.grupoId,
      },
    });

    if (existe) {
      throw new ConflictException(
        'El participante ya está inscrito en este grupo',
      );
    }

    const inscripcion = this.inscripcionRepository.create({
      ...createDto,
      userCreaId: userId,
    });

    return this.inscripcionRepository.save(inscripcion);
  }

  /**
   * Obtener todas las inscripciones
   */
  async findAll(): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      relations: [
        'participante',
        'grupo',
        'grupo.programa',
        'grupo.programa.tipoPrograma',
        'estado',
      ],
      order: { fechaInscripcion: 'DESC' },
    });
  }

  /**
   * Obtener inscripciones por grupo
   */
  async findByGrupo(grupoId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      where: { grupoId },
      relations: ['participante', 'grupo', 'grupo.programa', 'estado'],
      order: { fechaInscripcion: 'DESC' },
    });
  }

  /**
   * Obtener inscripciones por participante
   */
  async findByParticipante(participanteId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      where: { participanteId },
      relations: ['grupo', 'grupo.programa', 'estado'],
      order: { fechaInscripcion: 'DESC' },
    });
  }

  /**
   * Obtener inscripciones por estado
   */
  async findByEstado(estadoId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      where: { estadoId },
      relations: ['participante', 'grupo', 'grupo.programa', 'estado'],
      order: { fechaInscripcion: 'DESC' },
    });
  }

  /**
   * Obtener una inscripción por ID
   */
  async findOne(id: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id },
      relations: [
        'participante',
        'grupo',
        'grupo.programa',
        'grupo.programa.tipoPrograma',
        'estado',
      ],
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    return inscripcion;
  }

  /**
   * Actualizar una inscripción
   */
  async update(
    id: number,
    updateDto: UpdateInscripcionDto,
    userId: number,
  ): Promise<Inscripcion> {
    const inscripcion = await this.findOne(id);

    // Si se cambia el participante o grupo, verificar duplicados
    if (
      updateDto.participanteId &&
      updateDto.participanteId !== inscripcion.participanteId
    ) {
      const existe = await this.inscripcionRepository.findOne({
        where: {
          participanteId: updateDto.participanteId,
          grupoId: updateDto.grupoId || inscripcion.grupoId,
        },
      });

      if (existe) {
        throw new ConflictException(
          'El participante ya está inscrito en este grupo',
        );
      }
    }

    if (updateDto.grupoId && updateDto.grupoId !== inscripcion.grupoId) {
      const existe = await this.inscripcionRepository.findOne({
        where: {
          participanteId:
            updateDto.participanteId || inscripcion.participanteId,
          grupoId: updateDto.grupoId,
        },
      });

      if (existe) {
        throw new ConflictException(
          'El participante ya está inscrito en este grupo',
        );
      }
    }

    Object.assign(inscripcion, updateDto);
    inscripcion.userActualizaId = userId;

    return this.inscripcionRepository.save(inscripcion);
  }

  /**
   * Cambiar el estado de una inscripción
   */
async changeEstado(id: number, estadoId: number, userId: number): Promise<Inscripcion> {
  await this.inscripcionRepository.update(id, {
    estadoId,
    userActualizaId: userId,
  });
  return this.findOne(id);
}

  /**
   * Eliminar una inscripción
   */
  async remove(id: number): Promise<void> {
    const inscripcion = await this.findOne(id);
    await this.inscripcionRepository.remove(inscripcion);
  }
}
