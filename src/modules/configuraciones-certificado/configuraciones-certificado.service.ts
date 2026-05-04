import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionCertificado } from './entities/configuracion-certificado.entity';
import { ConfiguracionLogo } from './entities/configuracion-logo.entity';
import { ConfiguracionFirma } from './entities/configuracion-firma.entity';
import { CreateConfiguracionCertificadoDto } from './dto/create-configuracion-certificado.dto';
import { UpdateConfiguracionCertificadoDto } from './dto/update-configuracion-certificado.dto';

@Injectable()
export class ConfiguracionesCertificadoService {
  constructor(
    @InjectRepository(ConfiguracionCertificado)
    private readonly configuracionRepository: Repository<ConfiguracionCertificado>,
    @InjectRepository(ConfiguracionLogo)
    private readonly configuracionLogoRepository: Repository<ConfiguracionLogo>,
    @InjectRepository(ConfiguracionFirma)
    private readonly configuracionFirmaRepository: Repository<ConfiguracionFirma>,
  ) {}

  /**
   * Crear una nueva configuración de certificado
   */
  async create(
    createDto: CreateConfiguracionCertificadoDto,
    userId: number,
  ): Promise<ConfiguracionCertificado> {
    const configuracion = this.configuracionRepository.create({
      programaId: createDto.programaId,
      plantillaUrl: createDto.plantillaUrl,
      activo: createDto.activo ?? true,
      userCreaId: userId,
    });

    const savedConfig = await this.configuracionRepository.save(configuracion);

    // Asociar logos si se proporcionaron
    if (createDto.logos && createDto.logos.length > 0) {
      const logos = createDto.logos.map((logo) =>
        this.configuracionLogoRepository.create({
          configuracionId: savedConfig.id,
          logoId: logo.logoId,
        }),
      );
      await this.configuracionLogoRepository.save(logos);
    }

    // Asociar firmas si se proporcionaron
    if (createDto.firmas && createDto.firmas.length > 0) {
      const firmas = createDto.firmas.map((firma) =>
        this.configuracionFirmaRepository.create({
          configuracionId: savedConfig.id,
          firmaId: firma.firmaId,
        }),
      );
      await this.configuracionFirmaRepository.save(firmas);
    }

    return this.findOne(savedConfig.id);
  }

  /**
   * Obtener todas las configuraciones
   */
  async findAll(): Promise<ConfiguracionCertificado[]> {
    return await this.configuracionRepository.find({
      relations: ['programa', 'logos', 'firmas', 'logos.logo', 'firmas.firma'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtener configuraciones activas
   */
  async findAllActive(): Promise<ConfiguracionCertificado[]> {
    return await this.configuracionRepository.find({
      where: { activo: true },
      relations: ['programa', 'logos', 'firmas', 'logos.logo', 'firmas.firma'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtener configuración por ID
   */
  async findOne(id: number): Promise<ConfiguracionCertificado> {
    const configuracion = await this.configuracionRepository.findOne({
      where: { id },
      relations: ['programa', 'logos', 'firmas', 'logos.logo', 'firmas.firma'],
    });

    if (!configuracion) {
      throw new NotFoundException(`Configuración con ID ${id} no encontrada`);
    }

    return configuracion;
  }

  /**
   * Obtener configuración por programa
   */
  async findByPrograma(programaId: number): Promise<ConfiguracionCertificado> {
    const configuracion = await this.configuracionRepository.findOne({
      where: { programaId, activo: true },
      relations: ['programa', 'logos', 'firmas', 'logos.logo', 'firmas.firma'],
    });

    if (!configuracion) {
      throw new NotFoundException(
        `No hay configuración activa para el programa ${programaId}`,
      );
    }

    return configuracion;
  }

  /**
   * Actualizar una configuración
   */
  async update(
    id: number,
    updateDto: UpdateConfiguracionCertificadoDto,
    userId: number,
  ): Promise<ConfiguracionCertificado> {
    const configuracion = await this.findOne(id);

    // Actualizar datos básicos
    Object.assign(configuracion, {
      programaId: updateDto.programaId ?? configuracion.programaId,
      plantillaUrl: updateDto.plantillaUrl ?? configuracion.plantillaUrl,
      activo: updateDto.activo ?? configuracion.activo,
      userActualizaId: userId,
    });

    await this.configuracionRepository.save(configuracion);

    // Actualizar logos si se proporcionaron
    if (updateDto.logos !== undefined) {
      // Eliminar logos actuales
      await this.configuracionLogoRepository.delete({ configuracionId: id });

      // Agregar nuevos logos
      if (updateDto.logos.length > 0) {
        const logos = updateDto.logos.map((logo) =>
          this.configuracionLogoRepository.create({
            configuracionId: id,
            logoId: logo.logoId,
          }),
        );
        await this.configuracionLogoRepository.save(logos);
      }
    }

    // Actualizar firmas si se proporcionaron
    if (updateDto.firmas !== undefined) {
      // Eliminar firmas actuales
      await this.configuracionFirmaRepository.delete({ configuracionId: id });

      // Agregar nuevas firmas
      if (updateDto.firmas.length > 0) {
        const firmas = updateDto.firmas.map((firma) =>
          this.configuracionFirmaRepository.create({
            configuracionId: id,
            firmaId: firma.firmaId,
          }),
        );
        await this.configuracionFirmaRepository.save(firmas);
      }
    }

    return this.findOne(id);
  }

  /**
   * Activar/Desactivar una configuración
   */
  async toggleActive(
    id: number,
    userId: number,
  ): Promise<ConfiguracionCertificado> {
    const configuracion = await this.findOne(id);

    configuracion.activo = !configuracion.activo;
    configuracion.userActualizaId = userId;

    await this.configuracionRepository.save(configuracion);

    return this.findOne(id);
  }

  /**
   * Eliminar una configuración
   */
  async remove(id: number): Promise<void> {
    const configuracion = await this.findOne(id);

    // Las relaciones en cascada eliminarán automáticamente logos y firmas
    await this.configuracionRepository.remove(configuracion);
  }
}
