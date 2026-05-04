import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoCertificado } from './entities/estado-certificado.entity';
import { CreateEstadoCertificadoDto } from './dto/create-estado-certificado.dto';
import { UpdateEstadoCertificadoDto } from './dto/update-estado-certificado.dto';

@Injectable()
export class EstadoCertificadoService {
  constructor(
    @InjectRepository(EstadoCertificado)
    private readonly estadoCertificadoRepository: Repository<EstadoCertificado>,
  ) {}

  /**
   * Crear un nuevo estado de certificado
   */
  async create(
    createEstadoCertificadoDto: CreateEstadoCertificadoDto,
  ): Promise<EstadoCertificado> {
    const estado = this.estadoCertificadoRepository.create(
      createEstadoCertificadoDto,
    );

    return await this.estadoCertificadoRepository.save(estado);
  }

  /**
   * Obtener todos los estados de certificado
   */
  async findAll(): Promise<EstadoCertificado[]> {
    return await this.estadoCertificadoRepository.find();
  }

  /**
   * Obtener un estado por ID
   */
  async findOne(id: number): Promise<EstadoCertificado> {
    const estado = await this.estadoCertificadoRepository.findOne({
      where: { id },
    });

    if (!estado) {
      throw new NotFoundException(
        `Estado de certificado con ID ${id} no encontrado`,
      );
    }

    return estado;
  }

  /**
   * Actualizar un estado
   */
  async update(
    id: number,
    updateEstadoCertificadoDto: UpdateEstadoCertificadoDto,
  ): Promise<EstadoCertificado> {
    const estado = await this.findOne(id);

    Object.assign(estado, updateEstadoCertificadoDto);

    return await this.estadoCertificadoRepository.save(estado);
  }

  /**
   * Eliminar un estado
   */
  async remove(id: number): Promise<void> {
    const estado = await this.findOne(id);
    await this.estadoCertificadoRepository.remove(estado);
  }
}
