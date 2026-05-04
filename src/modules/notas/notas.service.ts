import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota } from './entities/nota.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Unidad } from '../unidades/entities/unidad.entity';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';

@Injectable()
export class NotasService {
  constructor(
    @InjectRepository(Nota)
    private notaRepository: Repository<Nota>,
    @InjectRepository(Inscripcion)
    private inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Unidad)
    private unidadRepository: Repository<Unidad>,
  ) {}

  async create(createNotaDto: CreateNotaDto): Promise<Nota> {
    // Validar que la inscripción existe
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id: createNotaDto.inscripcionId },
      relations: ['grupo', 'grupo.programa'],
    });

    if (!inscripcion) {
      throw new NotFoundException(
        `Inscripción con ID ${createNotaDto.inscripcionId} no encontrada`,
      );
    }

    // Validar que la unidad existe
    const unidad = await this.unidadRepository.findOne({
      where: { id: createNotaDto.unidadId },
      relations: ['programa'],
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${createNotaDto.unidadId} no encontrada`);
    }

    // Validar que la unidad pertenece al programa de la inscripción
    if (unidad.programaId !== inscripcion.grupo.programa.id) {
      throw new BadRequestException(
        'La unidad no pertenece al programa de esta inscripción',
      );
    }

    // Verificar si ya existe una nota para esta inscripción y unidad
    const notaExistente = await this.notaRepository.findOne({
      where: {
        inscripcionId: createNotaDto.inscripcionId,
        unidadId: createNotaDto.unidadId,
      },
    });

    if (notaExistente) {
      throw new BadRequestException(
        'Ya existe una nota registrada para esta inscripción y unidad',
      );
    }

    const nota = this.notaRepository.create(createNotaDto);
    return await this.notaRepository.save(nota);
  }

  async findAll(): Promise<Nota[]> {
    return await this.notaRepository.find({
      relations: ['inscripcion', 'unidad', 'inscripcion.participante'],
    });
  }

  async findOne(id: number): Promise<Nota> {
    const nota = await this.notaRepository.findOne({
      where: { id },
      relations: ['inscripcion', 'unidad', 'inscripcion.participante'],
    });

    if (!nota) {
      throw new NotFoundException(`Nota con ID ${id} no encontrada`);
    }

    return nota;
  }

  async findByInscripcion(inscripcionId: number): Promise<Nota[]> {
    return await this.notaRepository.find({
      where: { inscripcionId },
      relations: ['unidad'],
      order: { unidad: { orden: 'ASC' } },
    });
  }

  async findByUnidad(unidadId: number): Promise<Nota[]> {
    return await this.notaRepository.find({
      where: { unidadId },
      relations: ['inscripcion', 'inscripcion.participante'],
    });
  }

  async update(id: number, updateNotaDto: UpdateNotaDto): Promise<Nota> {
    const nota = await this.findOne(id);
    Object.assign(nota, updateNotaDto);
    return await this.notaRepository.save(nota);
  }

  async remove(id: number): Promise<void> {
    const nota = await this.findOne(id);
    await this.notaRepository.remove(nota);
  }

  /**
   * Calcula la nota final ponderada de una inscripción
   * Formula: nota_final = SUMA(nota * peso) / 100
   */
  async calcularNotaFinal(inscripcionId: number): Promise<{
    notaFinal: number;
    notasDetalle: Array<{
      unidad: string;
      nota: number;
      peso: number;
      aporte: number;
    }>;
    aprobado: boolean;
    notaMinimaAprobatoria: number;
  }> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id: inscripcionId },
      relations: ['grupo', 'grupo.programa'],
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${inscripcionId} no encontrada`);
    }

    const notas = await this.notaRepository.find({
      where: { inscripcionId },
      relations: ['unidad'],
      order: { unidad: { orden: 'ASC' } },
    });

    if (notas.length === 0) {
      throw new BadRequestException('No hay notas registradas para esta inscripción');
    }

    let notaFinal = 0;
    const notasDetalle: Array<{
      unidad: string;
      nota: number;
      peso: number;
      aporte: number;
    }> = [];

    for (const nota of notas) {
      const aporte = (Number(nota.nota) * Number(nota.unidad.peso)) / 100;
      notaFinal += aporte;

      notasDetalle.push({
        unidad: nota.unidad.nombre,
        nota: Number(nota.nota),
        peso: Number(nota.unidad.peso),
        aporte: Number(aporte.toFixed(2)),
      });
    }

    // Redondear a 2 decimales
    notaFinal = Number(notaFinal.toFixed(2));

    const notaMinimaAprobatoria = Number(inscripcion.grupo.programa.notaMinimaAprobatoria);
    const aprobado = notaFinal >= notaMinimaAprobatoria;

    return {
      notaFinal,
      notasDetalle,
      aprobado,
      notaMinimaAprobatoria,
    };
  }

  /**
   * Registra múltiples notas para una unidad (para un grupo completo)
   */
  async registrarNotasGrupales(
    unidadId: number,
    notas: Array<{ inscripcionId: number; nota: number; observaciones?: string }>,
    userCreaId?: number,
  ): Promise<Nota[]> {
    const notasCreadas: Nota[] = [];

    for (const notaData of notas) {
      try {
        const nota = await this.create({
          inscripcionId: notaData.inscripcionId,
          unidadId,
          nota: notaData.nota,
          observaciones: notaData.observaciones,
          userCreaId,
        });
        notasCreadas.push(nota);
      } catch (error) {
        // Si ya existe, la actualizamos
        const notaExistente = await this.notaRepository.findOne({
          where: {
            inscripcionId: notaData.inscripcionId,
            unidadId,
          },
        });

        if (notaExistente) {
          await this.update(notaExistente.id, {
            nota: notaData.nota,
            observaciones: notaData.observaciones,
            userActualizaId: userCreaId,
          });
          notasCreadas.push(notaExistente);
        }
      }
    }

    return notasCreadas;
  }
}
