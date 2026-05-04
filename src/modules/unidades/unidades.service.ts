import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidad } from './entities/unidad.entity';
import { Programa } from '../programas/entities/programa.entity';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidad)
    private unidadRepository: Repository<Unidad>,
    @InjectRepository(Programa)
    private programaRepository: Repository<Programa>,
  ) {}

  async create(createUnidadDto: CreateUnidadDto): Promise<Unidad> {
    // Validar que el programa existe y tiene evaluación
    const programa = await this.programaRepository.findOne({
      where: { id: createUnidadDto.programaId },
    });

    if (!programa) {
      throw new NotFoundException(`Programa con ID ${createUnidadDto.programaId} no encontrado`);
    }

    if (!programa.tieneEvaluacion) {
      throw new BadRequestException(
        'No se pueden crear unidades para un programa que no tiene evaluación',
      );
    }

    // Validar que el peso total no exceda 100%
    await this.validarPesoTotal(createUnidadDto.programaId, createUnidadDto.peso);

    const unidad = this.unidadRepository.create(createUnidadDto);
    return await this.unidadRepository.save(unidad);
  }

  async findAll(): Promise<Unidad[]> {
    return await this.unidadRepository.find({
      relations: ['programa'],
      order: { programaId: 'ASC', orden: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Unidad> {
    const unidad = await this.unidadRepository.findOne({
      where: { id },
      relations: ['programa'],
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }

    return unidad;
  }

  async findByPrograma(programaId: number): Promise<Unidad[]> {
    return await this.unidadRepository.find({
      where: { programaId, activo: true },
      order: { orden: 'ASC' },
    });
  }

  async update(id: number, updateUnidadDto: UpdateUnidadDto): Promise<Unidad> {
    const unidad = await this.findOne(id);

    // Si se está actualizando el peso, validar el total
    if (updateUnidadDto.peso !== undefined) {
      await this.validarPesoTotal(
        unidad.programaId,
        updateUnidadDto.peso,
        id, // Excluir esta unidad del cálculo
      );
    }

    Object.assign(unidad, updateUnidadDto);
    return await this.unidadRepository.save(unidad);
  }

  async remove(id: number): Promise<void> {
    const unidad = await this.findOne(id);
    await this.unidadRepository.remove(unidad);
  }

  async validarPesoTotal(
    programaId: number,
    nuevoPeso: number,
    excluirUnidadId?: number,
  ): Promise<void> {
    const unidades = await this.unidadRepository.find({
      where: { programaId, activo: true },
    });

    // Calcular peso total excluyendo la unidad actual si se especifica
    const pesoTotal = unidades
      .filter((u) => u.id !== excluirUnidadId)
      .reduce((sum, u) => sum + Number(u.peso), 0);

    const pesoFinal = pesoTotal + Number(nuevoPeso);

    if (pesoFinal > 100) {
      throw new BadRequestException(
        `El peso total de las unidades no puede exceder 100%. Peso actual: ${pesoTotal}%, nuevo peso: ${nuevoPeso}%, total: ${pesoFinal}%`,
      );
    }
  }

  async calcularPesoTotal(programaId: number): Promise<number> {
    const unidades = await this.unidadRepository.find({
      where: { programaId, activo: true },
    });

    return unidades.reduce((sum, u) => sum + Number(u.peso), 0);
  }
}
