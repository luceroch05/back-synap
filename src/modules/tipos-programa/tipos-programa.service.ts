import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoPrograma } from './entities/tipo-programa.entity';
import { CreateTipoProgramaDto } from './dto/create-tipo-programa.dto';
import { UpdateTipoProgramaDto } from './dto/update-tipo-programa.dto';

/**
 * Servicio de Tipos de Programa
 * Gestión de tipos: Diplomado, Curso, Taller, etc.
 */
@Injectable()
export class TiposProgramaService {
  constructor(
    @InjectRepository(TipoPrograma)
    private readonly tipoProgramaRepository: Repository<TipoPrograma>,
  ) {}

  /**
   * Crear un nuevo tipo de programa
   */
  async create(createDto: CreateTipoProgramaDto): Promise<TipoPrograma> {
    // Verificar si el tipo ya existe
    const existente = await this.tipoProgramaRepository.findOne({
      where: { nombre: createDto.nombre },
    });

    if (existente) {
      throw new ConflictException(
        `El tipo de programa '${createDto.nombre}' ya existe`,
      );
    }

    const tipo = this.tipoProgramaRepository.create(createDto);
    return await this.tipoProgramaRepository.save(tipo);
  }

  /**
   * Listar todos los tipos de programa
   */
  async findAll(): Promise<TipoPrograma[]> {
    return await this.tipoProgramaRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  /**
   * Listar solo tipos activos
   */
  async findAllActive(): Promise<TipoPrograma[]> {
    return await this.tipoProgramaRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  /**
   * Obtener un tipo por ID
   */
  async findOne(id: number): Promise<TipoPrograma> {
    const tipo = await this.tipoProgramaRepository.findOne({
      where: { id },
    });

    if (!tipo) {
      throw new NotFoundException(
        `Tipo de programa con ID ${id} no encontrado`,
      );
    }

    return tipo;
  }

  /**
   * Actualizar un tipo de programa
   */
  async update(
    id: number,
    updateDto: UpdateTipoProgramaDto,
  ): Promise<TipoPrograma> {
    const tipo = await this.findOne(id);

    // Verificar nombre duplicado
    if (updateDto.nombre && updateDto.nombre !== tipo.nombre) {
      const existente = await this.tipoProgramaRepository.findOne({
        where: { nombre: updateDto.nombre },
      });

      if (existente) {
        throw new ConflictException(
          `El tipo de programa '${updateDto.nombre}' ya existe`,
        );
      }
    }

    Object.assign(tipo, updateDto);
    return await this.tipoProgramaRepository.save(tipo);
  }

  /**
   * Eliminar un tipo de programa
   */
  async remove(id: number): Promise<void> {
    const tipo = await this.findOne(id);
    await this.tipoProgramaRepository.remove(tipo);
  }

  /**
   * Activar/Desactivar un tipo de programa
   */
  async toggleActive(id: number): Promise<TipoPrograma> {
    const tipo = await this.findOne(id);
    tipo.activo = !tipo.activo;
    return await this.tipoProgramaRepository.save(tipo);
  }
}
