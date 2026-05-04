import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programa } from './entities/programa.entity';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { TiposProgramaService } from '../tipos-programa/tipos-programa.service';

/**
 * Servicio de Programas
 * Gestión de programas académicos
 */
@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(Programa)
    private readonly programaRepository: Repository<Programa>,
    private readonly tiposProgramaService: TiposProgramaService,
  ) {}

  /**
   * Crear un nuevo programa
   */
  async create(
    createDto: CreateProgramaDto,
    userId: number,
  ): Promise<Programa> {
    // Verificar que el tipo de programa existe
    await this.tiposProgramaService.findOne(createDto.tipoProgramaId);

    // Verificar nombre duplicado
    const existente = await this.programaRepository.findOne({
      where: { nombre: createDto.nombre },
    });

    if (existente) {
      throw new ConflictException(
        `El programa '${createDto.nombre}' ya existe`,
      );
    }

    const programa = this.programaRepository.create({
      ...createDto,
      userCreaId: userId,
    });

    return await this.programaRepository.save(programa);
  }

  /**
   * Listar todos los programas
   */
  async findAll(): Promise<Programa[]> {
    return await this.programaRepository.find({
      relations: ['tipoPrograma'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Listar solo programas activos
   */
  async findAllActive(): Promise<Programa[]> {
    return await this.programaRepository.find({
      where: { activo: true },
      relations: ['tipoPrograma'],
      order: { nombre: 'ASC' },
    });
  }

  /**
   * Obtener un programa por ID
   */
  async findOne(id: number): Promise<Programa> {
    const programa = await this.programaRepository.findOne({
      where: { id },
      relations: ['tipoPrograma', 'userCrea', 'userActualiza'],
    });

    if (!programa) {
      throw new NotFoundException(`Programa con ID ${id} no encontrado`);
    }

    return programa;
  }

  /**
   * Actualizar un programa
   */
  async update(
    id: number,
    updateDto: UpdateProgramaDto,
    userId: number,
  ): Promise<Programa> {
    const programa = await this.findOne(id);

    // Verificar tipo de programa si se está cambiando
    if (updateDto.tipoProgramaId) {
      await this.tiposProgramaService.findOne(updateDto.tipoProgramaId);
    }

    // Verificar nombre duplicado
    if (updateDto.nombre && updateDto.nombre !== programa.nombre) {
      const existente = await this.programaRepository.findOne({
        where: { nombre: updateDto.nombre },
      });

      if (existente) {
        throw new ConflictException(
          `El programa '${updateDto.nombre}' ya existe`,
        );
      }
    }

    Object.assign(programa, updateDto);
    programa.userActualizaId = userId;

    return await this.programaRepository.save(programa);
  }

  /**
   * Eliminar un programa
   */
  async remove(id: number): Promise<void> {
    const programa = await this.findOne(id);
    await this.programaRepository.remove(programa);
  }

  /**
   * Activar/Desactivar un programa
   */
  async toggleActive(id: number, userId: number): Promise<Programa> {
    const programa = await this.findOne(id);
    programa.activo = !programa.activo;
    programa.userActualizaId = userId;
    return await this.programaRepository.save(programa);
  }
}
