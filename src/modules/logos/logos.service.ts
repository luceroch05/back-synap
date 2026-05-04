import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logo } from './entities/logo.entity';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';

@Injectable()
export class LogosService {
  constructor(
    @InjectRepository(Logo)
    private readonly logoRepository: Repository<Logo>,
  ) {}

  /**
   * Crear un nuevo logo
   */
  async create(createLogoDto: CreateLogoDto, userId: number): Promise<Logo> {
    const logo = this.logoRepository.create({
      ...createLogoDto,
      userCreaId: userId,
    });

    return await this.logoRepository.save(logo);
  }

  /**
   * Obtener todos los logos
   */
  async findAll(): Promise<Logo[]> {
    return await this.logoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtener logos activos
   */
  async findAllActive(): Promise<Logo[]> {
    return await this.logoRepository.find({
      where: { activo: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtener un logo por ID
   */
  async findOne(id: number): Promise<Logo> {
    const logo = await this.logoRepository.findOne({ where: { id } });

    if (!logo) {
      throw new NotFoundException(`Logo con ID ${id} no encontrado`);
    }

    return logo;
  }

  /**
   * Actualizar un logo
   */
  async update(
    id: number,
    updateLogoDto: UpdateLogoDto,
    userId: number,
  ): Promise<Logo> {
    const logo = await this.findOne(id);

    Object.assign(logo, {
      ...updateLogoDto,
      userActualizaId: userId,
    });

    return await this.logoRepository.save(logo);
  }

  /**
   * Activar/Desactivar un logo
   */
  async toggleActive(id: number, userId: number): Promise<Logo> {
    const logo = await this.findOne(id);

    logo.activo = !logo.activo;
    logo.userActualizaId = userId;

    return await this.logoRepository.save(logo);
  }

  /**
   * Eliminar un logo
   */
  async remove(id: number): Promise<void> {
    const logo = await this.findOne(id);
    await this.logoRepository.remove(logo);
  }
}
