import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Firma } from './entities/firma.entity';
import { CreateFirmaDto } from './dto/create-firma.dto';
import { UpdateFirmaDto } from './dto/update-firma.dto';

@Injectable()
export class FirmasService {
  constructor(
    @InjectRepository(Firma)
    private readonly firmaRepository: Repository<Firma>,
  ) {}

  /**
   * Crear una nueva firma
   */
  async create(createFirmaDto: CreateFirmaDto, userId: number): Promise<Firma> {
    const firma = this.firmaRepository.create({
      ...createFirmaDto,
      userCreaId: userId,
    });

    return await this.firmaRepository.save(firma);
  }

  /**
   * Obtener todas las firmas
   */
  async findAll(): Promise<Firma[]> {
    return await this.firmaRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtener firmas activas
   */
  async findAllActive(): Promise<Firma[]> {
    return await this.firmaRepository.find({
      where: { activo: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtener una firma por ID
   */
  async findOne(id: number): Promise<Firma> {
    const firma = await this.firmaRepository.findOne({ where: { id } });

    if (!firma) {
      throw new NotFoundException(`Firma con ID ${id} no encontrada`);
    }

    return firma;
  }

  /**
   * Actualizar una firma
   */
  async update(
    id: number,
    updateFirmaDto: UpdateFirmaDto,
    userId: number,
  ): Promise<Firma> {
    const firma = await this.findOne(id);

    Object.assign(firma, {
      ...updateFirmaDto,
      userActualizaId: userId,
    });

    return await this.firmaRepository.save(firma);
  }

  /**
   * Activar/Desactivar una firma
   */
  async toggleActive(id: number, userId: number): Promise<Firma> {
    const firma = await this.findOne(id);

    firma.activo = !firma.activo;
    firma.userActualizaId = userId;

    return await this.firmaRepository.save(firma);
  }

  /**
   * Eliminar una firma
   */
  async remove(id: number): Promise<void> {
    const firma = await this.findOne(id);
    await this.firmaRepository.remove(firma);
  }
}
