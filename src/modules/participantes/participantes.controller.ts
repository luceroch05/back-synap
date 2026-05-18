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
export class ParticipantesController {
  constructor(private readonly participantesService: ParticipantesService) {}

  /**
   * GET /participantes/buscar
   * Buscar por documento — público para autocompletar en inscripción pública
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
   * POST /participantes
   * Crear un nuevo participante
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateParticipanteDto, @Request() req) {
    return this.participantesService.create(createDto, req.user.id);
  }

  /**
   * GET /participantes
   * Listar todos los participantes
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.participantesService.findAll();
  }

  /**
   * GET /participantes/activos
   * Listar solo participantes activos
   */
  @Get('activos')
  @UseGuards(JwtAuthGuard)
  findAllActive() {
    return this.participantesService.findAllActive();
  }

  /**
   * GET /participantes/:id
   * Obtener un participante por ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.participantesService.findOne(+id);
  }

  /**
   * PATCH /participantes/:id
   * Actualizar un participante
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  toggleActive(@Param('id') id: string, @Request() req) {
    return this.participantesService.toggleActive(+id, req.user.id);
  }

  /**
   * DELETE /participantes/:id
   * Eliminar un participante
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.participantesService.remove(+id);
  }
}
