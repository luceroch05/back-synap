import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Query,
} from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { CreateInscripcionPublicaDto } from './dto/create-inscripcion-publica.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Controlador de Inscripciones
 * Endpoints para gestionar inscripciones de participantes a grupos
 */
@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  /**
   * POST /inscripciones/publica
   * Inscripción pública: el estudiante se registra y se inscribe en un curso sin autenticación
   */
  @Post('publica')
  @HttpCode(HttpStatus.CREATED)
  createPublica(@Body() dto: CreateInscripcionPublicaDto) {
    return this.inscripcionesService.createPublica(dto);
  }

  /**
   * POST /inscripciones
   * Crear una nueva inscripción (requiere autenticación)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateInscripcionDto, @Request() req) {
    return this.inscripcionesService.create(createDto, req.user.id);
  }

  /**
   * GET /inscripciones
   * Listar todas las inscripciones con filtros opcionales
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('grupoId') grupoId?: string,
    @Query('participanteId') participanteId?: string,
    @Query('estadoId') estadoId?: string,
  ) {
    if (grupoId) {
      return this.inscripcionesService.findByGrupo(+grupoId);
    }
    if (participanteId) {
      return this.inscripcionesService.findByParticipante(+participanteId);
    }
    if (estadoId) {
      return this.inscripcionesService.findByEstado(+estadoId);
    }
    return this.inscripcionesService.findAll();
  }

  /**
   * GET /inscripciones/:id
   * Obtener una inscripción por ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.inscripcionesService.findOne(+id);
  }

  /**
   * PATCH /inscripciones/:id
   * Actualizar una inscripción
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateInscripcionDto,
    @Request() req,
  ) {
    return this.inscripcionesService.update(+id, updateDto, req.user.id);
  }

  /**
   * PATCH /inscripciones/:id/estado/:estadoId
   * Cambiar el estado de una inscripción
   */
  @Patch(':id/estado/:estadoId')
  @UseGuards(JwtAuthGuard)
  changeEstado(
    @Param('id') id: string,
    @Param('estadoId') estadoId: string,
    @Request() req,
  ) {
    return this.inscripcionesService.changeEstado(
      +id,
      +estadoId,
      req.user.id,
    );
  }

  /**
   * DELETE /inscripciones/:id
   * Eliminar una inscripción
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.inscripcionesService.remove(+id);
  }
}
