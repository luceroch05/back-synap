import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Certificado } from './entities/certificado.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import {
  GenerarCertificadoDto,
  GenerarCertificadosMasivosDto,
} from './dto/generar-certificado.dto';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { ConfiguracionesCertificadoService } from '../configuraciones-certificado/configuraciones-certificado.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CertificadosService {
  constructor(
    @InjectRepository(Certificado)
    private readonly certificadoRepository: Repository<Certificado>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    private readonly pdfGeneratorService: PdfGeneratorService,
    private readonly configuracionesService: ConfiguracionesCertificadoService,
  ) {}

  /**
   * Crear un certificado manualmente
   */
  async create(
    createDto: CreateCertificadoDto,
    userId: number,
  ): Promise<Certificado> {
    // Verificar que la inscripción existe
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id: createDto.inscripcionId },
      relations: ['participante', 'grupo', 'grupo.programa', 'estado'],
    });

    if (!inscripcion) {
      throw new NotFoundException(
        `Inscripción con ID ${createDto.inscripcionId} no encontrada`,
      );
    }

    // Verificar que no exista ya un certificado para esta inscripción
    const existente = await this.certificadoRepository.findOne({
      where: { inscripcionId: createDto.inscripcionId },
    });

    if (existente) {
      throw new ConflictException(
        `Ya existe un certificado para esta inscripción`,
      );
    }

    const certificado = this.certificadoRepository.create({
      ...createDto,
      userCreaId: userId,
    });

    return await this.certificadoRepository.save(certificado);
  }

  /**
   * Obtener todos los certificados
   */
  async findAll(): Promise<Certificado[]> {
    return await this.certificadoRepository.find({
      relations: ['inscripcion', 'inscripcion.participante', 'inscripcion.grupo', 'estado'],
      order: { fechaEmision: 'DESC' },
    });
  }

  /**
   * Obtener certificados por estado
   */
  async findByEstado(estadoId: number): Promise<Certificado[]> {
    return await this.certificadoRepository.find({
      where: { estadoId },
      relations: ['inscripcion', 'inscripcion.participante', 'inscripcion.grupo', 'estado'],
      order: { fechaEmision: 'DESC' },
    });
  }

  /**
   * Obtener certificado por código único
   */
  async findByCodigoUnico(codigoUnico: string): Promise<Certificado> {
    const certificado = await this.certificadoRepository.findOne({
      where: { codigoUnico },
      relations: [
        'inscripcion',
        'inscripcion.participante',
        'inscripcion.grupo',
        'inscripcion.grupo.programa',
        'inscripcion.grupo.programa.tipoPrograma',
        'estado',
      ],
    });

    if (!certificado) {
      throw new NotFoundException(
        `Certificado con código ${codigoUnico} no encontrado`,
      );
    }

    return certificado;
  }

  /**
   * Obtener un certificado por ID
   */
  async findOne(id: number): Promise<Certificado> {
    const certificado = await this.certificadoRepository.findOne({
      where: { id },
      relations: [
        'inscripcion',
        'inscripcion.participante',
        'inscripcion.grupo',
        'inscripcion.grupo.programa',
        'estado',
      ],
    });

    if (!certificado) {
      throw new NotFoundException(`Certificado con ID ${id} no encontrado`);
    }

    return certificado;
  }

  /**
   * Actualizar un certificado
   */
  async update(
    id: number,
    updateDto: UpdateCertificadoDto,
    userId: number,
  ): Promise<Certificado> {
    const certificado = await this.findOne(id);

    Object.assign(certificado, {
      ...updateDto,
      userActualizaId: userId,
    });

    return await this.certificadoRepository.save(certificado);
  }

  /**
   * Anular un certificado
   */
  async anular(
    id: number,
    motivo: string,
    userId: number,
  ): Promise<Certificado> {
    const certificado = await this.findOne(id);

    const estadoAnuladoId = 3; // 3 = ANULADO

    certificado.estadoId = estadoAnuladoId;
    certificado.userActualizaId = userId;

    return await this.certificadoRepository.save(certificado);
  }

  /**
   * Eliminar un certificado (solo admins)
   */
  async remove(id: number): Promise<void> {
    const certificado = await this.findOne(id);
    await this.certificadoRepository.remove(certificado);
  }

  /**
   * Verificar si una inscripción ya tiene certificado
   */
  async verificarCertificadoExistente(
    inscripcionId: number,
  ): Promise<boolean> {
    const count = await this.certificadoRepository.count({
      where: { inscripcionId },
    });

    return count > 0;
  }

  /**
   * Obtener certificados por participante
   */
  async findByParticipante(participanteId: number): Promise<Certificado[]> {
    return await this.certificadoRepository
      .createQueryBuilder('certificado')
      .innerJoinAndSelect('certificado.inscripcion', 'inscripcion')
      .innerJoinAndSelect('inscripcion.participante', 'participante')
      .innerJoinAndSelect('inscripcion.grupo', 'grupo')
      .innerJoinAndSelect('grupo.programa', 'programa')
      .innerJoinAndSelect('certificado.estado', 'estado')
      .where('participante.id = :participanteId', { participanteId })
      .orderBy('certificado.fechaEmision', 'DESC')
      .getMany();
  }

  /**
   * Obtener certificados por programa
   */
  async findByPrograma(programaId: number): Promise<Certificado[]> {
    return await this.certificadoRepository
      .createQueryBuilder('certificado')
      .innerJoinAndSelect('certificado.inscripcion', 'inscripcion')
      .innerJoinAndSelect('inscripcion.participante', 'participante')
      .innerJoinAndSelect('inscripcion.grupo', 'grupo')
      .innerJoinAndSelect('grupo.programa', 'programa')
      .innerJoinAndSelect('certificado.estado', 'estado')
      .where('programa.id = :programaId', { programaId })
      .orderBy('certificado.fechaEmision', 'DESC')
      .getMany();
  }

  /**
   * Generar certificado individual con PDF
   */
  async generarCertificado(
    dto: GenerarCertificadoDto,
    userId: number,
  ): Promise<Certificado> {
    // 1. Verificar que la inscripción existe y está aprobada
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id: dto.inscripcionId },
      relations: [
        'participante',
        'grupo',
        'grupo.programa',
        'grupo.programa.tipoPrograma',
        'estado',
      ],
    });

    if (!inscripcion) {
      throw new NotFoundException(
        `Inscripción con ID ${dto.inscripcionId} no encontrada`,
      );
    }

    // Verificar que está aprobado (por nombre para no depender del ID)
    if (inscripcion.estado?.nombre !== 'APROBADO') {
      throw new BadRequestException(
        'Solo se pueden generar certificados para inscripciones aprobadas',
      );
    }

    // 2. Verificar que no exista certificado para esta inscripción
    const existe = await this.verificarCertificadoExistente(dto.inscripcionId);
    if (existe) {
      throw new ConflictException(
        'Ya existe un certificado para esta inscripción',
      );
    }

    // 3. Obtener configuración del certificado para el programa
    const configuracion = await this.configuracionesService.findByPrograma(
      dto.programaId,
    );

    if (!configuracion) {
      throw new NotFoundException(
        `No hay configuración de certificado activa para el programa ${dto.programaId}`,
      );
    }

    // 4. Crear el certificado en BD (esto genera el código único)
    const certificado = this.certificadoRepository.create({
      inscripcionId: dto.inscripcionId,
      fechaEmision: new Date(),
      estadoId: 2, // 2 = EMITIDO
      userCreaId: userId,
    });

    const certificadoGuardado = await this.certificadoRepository.save(
      certificado,
    );

    // 5. Generar el PDF
    try {
      const año = new Date().getFullYear();
      const mes = String(new Date().getMonth() + 1).padStart(2, '0');

      // Ruta de salida del PDF
      const directorioSalida = path.join(
        process.cwd(),
        'public',
        'certificados',
        String(año),
        mes,
      );

      // Crear directorio si no existe
      if (!fs.existsSync(directorioSalida)) {
        fs.mkdirSync(directorioSalida, { recursive: true });
      }

      const nombreArchivo = `${certificadoGuardado.codigoUnico}.pdf`;
      const rutaCompleta = path.join(directorioSalida, nombreArchivo);

      // Preparar datos para el PDF
      const nombreCompleto = `${inscripcion.participante.nombres} ${inscripcion.participante.apellidos}`;
      const nombrePrograma = inscripcion.grupo.programa.nombre;
      const tipoPrograma =
        inscripcion.grupo.programa.tipoPrograma?.nombre || 'Programa';
      const horasAcademicas = inscripcion.grupo.programa.horasAcademicas;

      const fechaEmisionFormateada = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // Preparar logos (máximo 3)
      const logosConfig = configuracion.logos ? configuracion.logos.slice(0, 3) : [];
      const logos = logosConfig.map((cl, index) => {
        // Asignar posiciones según cantidad:
        // 1 logo: posición 3 (centro)
        // 2 logos: posiciones 1 (izquierda) y 2 (derecha)
        // 3 logos: posiciones 1 (izquierda), 3 (centro), 2 (derecha)
        let posicion: 1 | 2 | 3;
        if (logosConfig.length === 1) {
          posicion = 3; // Centro
        } else if (logosConfig.length === 2) {
          posicion = (index === 0 ? 1 : 2) as 1 | 2; // Izquierda, Derecha
        } else {
          // 3 logos: [1, 3, 2] = Izquierda, Centro, Derecha
          posicion = (index === 0 ? 1 : index === 1 ? 3 : 2) as 1 | 2 | 3;
        }
        return {
          url: cl.logo.imagenLogo,
          posicion,
        };
      });

      // Preparar firmas (máximo 3)
      const firmasConfig = configuracion.firmas ? configuracion.firmas.slice(0, 3) : [];
      const firmas = firmasConfig.map((cf) => ({
        nombre: cf.firma.nombreAutoridad,
        cargo: cf.firma.cargo,
        firmaUrl: cf.firma.imagenFirma,
      }));

      // Generar título dinámico según tipo de programa
      const tituloTipoPrograma = tipoPrograma.toUpperCase();
      const titulo = `CERTIFICADO DE ${tituloTipoPrograma}`;

      // Generar PDF
      await this.pdfGeneratorService.generarCertificadoPDF({
        plantillaFondo: configuracion.plantillaUrl,
        logos,
        firmas,
        datos: {
          titulo: titulo,
          nombre: nombreCompleto,
          curso: nombrePrograma,
          fecha: fechaEmisionFormateada,
          horas: `${horasAcademicas}`,
          cuerpo: `Por haber completado satisfactoriamente el ${tipoPrograma} "{curso}" con una duración de {horas} horas académicas, realizado del ${new Date(inscripcion.grupo.fechaInicio).toLocaleDateString('es-ES')} al ${new Date(inscripcion.grupo.fechaFin).toLocaleDateString('es-ES')}.`,
        },
        codigo: certificadoGuardado.codigoUnico,
        outputPath: rutaCompleta,
      });

      // 6. Actualizar el certificado con la URL del PDF
      certificadoGuardado.url = `/certificados/${año}/${mes}/${nombreArchivo}`;
      await this.certificadoRepository.save(certificadoGuardado);

      console.log(
        `✅ Certificado generado: ${certificadoGuardado.codigoUnico}`,
      );

      return this.findOne(certificadoGuardado.id);
    } catch (error) {
      // Si falla la generación del PDF, eliminar el certificado de la BD
      await this.certificadoRepository.remove(certificadoGuardado);
      console.error('❌ Error al generar PDF del certificado:', error);
      throw new BadRequestException(
        `Error al generar el PDF del certificado: ${error.message}`,
      );
    }
  }

  /**
   * Generar certificados masivos
   */
  async generarCertificadosMasivos(
    dto: GenerarCertificadosMasivosDto,
    userId: number,
  ): Promise<{
    exitosos: Certificado[];
    fallidos: { inscripcionId: number; error: string }[];
  }> {
    const exitosos: Certificado[] = [];
    const fallidos: { inscripcionId: number; error: string }[] = [];

    for (const inscripcionId of dto.inscripcionesIds) {
      try {
        const certificado = await this.generarCertificado(
          {
            inscripcionId,
            programaId: dto.programaId,
          },
          userId,
        );

        exitosos.push(certificado);
      } catch (error) {
        fallidos.push({
          inscripcionId,
          error: error.message,
        });
      }
    }

    return { exitosos, fallidos };
  }
}
