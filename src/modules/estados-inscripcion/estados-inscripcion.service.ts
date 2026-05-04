import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoInscripcion } from './entities/estado-inscripcion.entity';
import { CreateEstadoInscripcionDto } from './dto/create-estado-inscripcion.dto';
import { UpdateEstadoInscripcionDto } from './dto/update-estado-inscripcion.dto';

/**
 * Servicio de Estados de Inscripción
 */
@Injectable()
export class EstadosInscripcionService {
  constructor(
    @InjectRepository(EstadoInscripcion)
    private estadoInscripcionRepository: Repository<EstadoInscripcion>,
  ) {}

  /**
   * Crear un nuevo estado de inscripción
   */
  async create(
    createDto: CreateEstadoInscripcionDto,
  ): Promise<EstadoInscripcion> {
    // Verificar si ya existe un estado con el mismo nombre
    const existe = await this.estadoInscripcionRepository.findOne({
      where: { nombre: createDto.nombre },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe un estado con el nombre "${createDto.nombre}"`,
      );
    }

    const estado = this.estadoInscripcionRepository.create(createDto);
    return this.estadoInscripcionRepository.save(estado);
  }

  /**
   * Obtener todos los estados de inscripción
   */
  async findAll(): Promise<EstadoInscripcion[]> {
    return this.estadoInscripcionRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  /**
   * Obtener un estado de inscripción por ID
   */
  async findOne(id: number): Promise<EstadoInscripcion> {
    const estado = await this.estadoInscripcionRepository.findOne({
      where: { id },
    });

    if (!estado) {
      throw new NotFoundException(
        `Estado de inscripción con ID ${id} no encontrado`,
      );
    }

    return estado;
  }

  /**
   * Actualizar un estado de inscripción
   */
  async update(
    id: number,
    updateDto: UpdateEstadoInscripcionDto,
  ): Promise<EstadoInscripcion> {
    const estado = await this.findOne(id);

    // Si se cambia el nombre, verificar que no exista otro con ese nombre
    if (updateDto.nombre && updateDto.nombre !== estado.nombre) {
      const existe = await this.estadoInscripcionRepository.findOne({
        where: { nombre: updateDto.nombre },
      });

      if (existe) {
        throw new ConflictException(
          `Ya existe un estado con el nombre "${updateDto.nombre}"`,
        );
      }
    }

    Object.assign(estado, updateDto);
    return this.estadoInscripcionRepository.save(estado);
  }

  /**
   * Eliminar un estado de inscripción
   */
  async remove(id: number): Promise<void> {
    const estado = await this.findOne(id);
    await this.estadoInscripcionRepository.remove(estado);
  }
}
