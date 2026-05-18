import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { CreateInscripcionPublicaDto } from './dto/create-inscripcion-publica.dto';
import { Participante } from '../participantes/entities/participante.entity';
import { EstadoInscripcion } from '../estados-inscripcion/entities/estado-inscripcion.entity';

/**
 * Servicio de Inscripciones
 */
@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Participante)
    private participanteRepository: Repository<Participante>,
    @InjectRepository(EstadoInscripcion)
    private estadoRepository: Repository<EstadoInscripcion>,
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
   * Inscripción pública: busca o crea el participante y luego lo inscribe al grupo
   */
  async createPublica(
    dto: CreateInscripcionPublicaDto,
  ): Promise<{ participante: Participante; inscripcion: Inscripcion }> {
    // Buscar o crear participante
    let participante = await this.participanteRepository.findOne({
      where: {
        tipoDocumento: dto.tipoDocumento,
        numeroDocumento: dto.numeroDocumento,
      },
    });

    if (!participante) {
      participante = this.participanteRepository.create({
        tipoDocumento: dto.tipoDocumento,
        numeroDocumento: dto.numeroDocumento,
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        email: dto.email,
        telefono: dto.telefono,
      });
      participante = await this.participanteRepository.save(participante);
    }

    // Verificar si ya está inscrito en este grupo
    const yaInscrito = await this.inscripcionRepository.findOne({
      where: { participanteId: participante.id, grupoId: dto.grupoId },
    });

    if (yaInscrito) {
      throw new ConflictException('Ya estás inscrito en este curso');
    }

    // Obtener el primer estado de inscripción disponible
    const estado = await this.estadoRepository.findOne({
      where: {},
      order: { id: 'ASC' },
    });

    if (!estado) {
      throw new BadRequestException(
        'No hay estados de inscripción configurados',
      );
    }

    const inscripcion = this.inscripcionRepository.create({
      participanteId: participante.id,
      grupoId: dto.grupoId,
      estadoId: estado.id,
      fechaInscripcion: new Date().toISOString().split('T')[0] as unknown as Date,
    });

    const saved = await this.inscripcionRepository.save(inscripcion);
    return { participante, inscripcion: saved };
  }

  /**
   * Eliminar una inscripción
   */
  async remove(id: number): Promise<void> {
    const inscripcion = await this.findOne(id);
    await this.inscripcionRepository.remove(inscripcion);
  }
}
