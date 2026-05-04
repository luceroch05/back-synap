import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrupoProgramas } from './entities/grupo-programa.entity';
import { CreateGrupoProgramaDto } from './dto/create-grupo-programa.dto';
import { UpdateGrupoProgramaDto } from './dto/update-grupo-programa.dto';

/**
 * Servicio de Grupos de Programas
 */
@Injectable()
export class GruposProgramasService {
  constructor(
    @InjectRepository(GrupoProgramas)
    private grupoProgramasRepository: Repository<GrupoProgramas>,
  ) {}

  /**
   * Crear un nuevo grupo de programa
   */
  async create(
    createDto: CreateGrupoProgramaDto,
    userId: number,
  ): Promise<GrupoProgramas> {
    // Validar que la fecha de fin sea posterior a la fecha de inicio
    const fechaInicio = new Date(createDto.fechaInicio);
    const fechaFin = new Date(createDto.fechaFin);

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }

    const grupo = this.grupoProgramasRepository.create({
      ...createDto,
      userCreaId: userId,
      activo: true,
    });

    return this.grupoProgramasRepository.save(grupo);
  }

  /**
   * Obtener todos los grupos de programas
   */
  async findAll(): Promise<GrupoProgramas[]> {
    return this.grupoProgramasRepository.find({
      relations: ['programa', 'programa.tipoPrograma'],
      order: { fechaInicio: 'DESC' },
    });
  }

  /**
   * Obtener solo grupos activos
   */
  async findAllActive(): Promise<GrupoProgramas[]> {
    return this.grupoProgramasRepository.find({
      where: { activo: true },
      relations: ['programa', 'programa.tipoPrograma'],
      order: { fechaInicio: 'DESC' },
    });
  }

  /**
   * Obtener grupos por programa
   */
  async findByPrograma(programaId: number): Promise<GrupoProgramas[]> {
    return this.grupoProgramasRepository.find({
      where: { programaId },
      relations: ['programa'],
      order: { fechaInicio: 'DESC' },
    });
  }

  /**
   * Obtener un grupo por ID
   */
  async findOne(id: number): Promise<GrupoProgramas> {
    const grupo = await this.grupoProgramasRepository.findOne({
      where: { id },
      relations: ['programa', 'programa.tipoPrograma'],
    });

    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    return grupo;
  }

  /**
   * Actualizar un grupo de programa
   */
  async update(
    id: number,
    updateDto: UpdateGrupoProgramaDto,
    userId: number,
  ): Promise<GrupoProgramas> {
    const grupo = await this.findOne(id);

    // Validar fechas si se están actualizando
    if (updateDto.fechaInicio || updateDto.fechaFin) {
      const fechaInicio = new Date(
        updateDto.fechaInicio || grupo.fechaInicio,
      );
      const fechaFin = new Date(updateDto.fechaFin || grupo.fechaFin);

      if (fechaFin <= fechaInicio) {
        throw new BadRequestException(
          'La fecha de fin debe ser posterior a la fecha de inicio',
        );
      }
    }

    Object.assign(grupo, updateDto);
    grupo.userActualizaId = userId;

    return this.grupoProgramasRepository.save(grupo);
  }

  /**
   * Activar/Desactivar un grupo
   */
  async toggleActive(id: number, userId: number): Promise<GrupoProgramas> {
    const grupo = await this.findOne(id);
    grupo.activo = !grupo.activo;
    grupo.userActualizaId = userId;

    return this.grupoProgramasRepository.save(grupo);
  }

  /**
   * Eliminar un grupo de programa
   */
  async remove(id: number): Promise<void> {
    const grupo = await this.findOne(id);
    await this.grupoProgramasRepository.remove(grupo);
  }
}
