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
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Controlador de Inscripciones
 * Endpoints para gestionar inscripciones de participantes a grupos
 */
@Controller('inscripciones')
@UseGuards(JwtAuthGuard)
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  /**
   * POST /inscripciones
   * Crear una nueva inscripción
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateInscripcionDto, @Request() req) {
    return this.inscripcionesService.create(createDto, req.user.id);
  }

  /**
   * GET /inscripciones
   * Listar todas las inscripciones con filtros opcionales
   */
  @Get()
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
  findOne(@Param('id') id: string) {
    return this.inscripcionesService.findOne(+id);
  }

  /**
   * PATCH /inscripciones/:id
   * Actualizar una inscripción
   */
  @Patch(':id')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.inscripcionesService.remove(+id);
  }
}
