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
import { ParticipantesService } from './participantes.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Controlador de Participantes
 * Endpoints para gestionar participantes
 */
@Controller('participantes')
@UseGuards(JwtAuthGuard)
export class ParticipantesController {
  constructor(private readonly participantesService: ParticipantesService) {}

  /**
   * POST /participantes
   * Crear un nuevo participante
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateParticipanteDto, @Request() req) {
    return this.participantesService.create(createDto, req.user.id);
  }

  /**
   * GET /participantes
   * Listar todos los participantes
   */
  @Get()
  findAll() {
    return this.participantesService.findAll();
  }

  /**
   * GET /participantes/activos
   * Listar solo participantes activos
   */
  @Get('activos')
  findAllActive() {
    return this.participantesService.findAllActive();
  }

  /**
   * GET /participantes/buscar
   * Buscar por documento
   */
  @Get('buscar')
  findByDocumento(
    @Query('tipoDocumento') tipoDocumento: string,
    @Query('numeroDocumento') numeroDocumento: string,
  ) {
    return this.participantesService.findByDocumento(
      tipoDocumento,
      numeroDocumento,
    );
  }

  /**
   * GET /participantes/:id
   * Obtener un participante por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantesService.findOne(+id);
  }

  /**
   * PATCH /participantes/:id
   * Actualizar un participante
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateParticipanteDto,
    @Request() req,
  ) {
    return this.participantesService.update(+id, updateDto, req.user.id);
  }

  /**
   * PATCH /participantes/:id/toggle
   * Activar/Desactivar un participante
   */
  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string, @Request() req) {
    return this.participantesService.toggleActive(+id, req.user.id);
  }

  /**
   * DELETE /participantes/:id
   * Eliminar un participante
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.participantesService.remove(+id);
  }
}
