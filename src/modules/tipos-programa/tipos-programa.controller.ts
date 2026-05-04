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
} from '@nestjs/common';
import { TiposProgramaService } from './tipos-programa.service';
import { CreateTipoProgramaDto } from './dto/create-tipo-programa.dto';
import { UpdateTipoProgramaDto } from './dto/update-tipo-programa.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Controlador de Tipos de Programa
 * Endpoints para gestionar tipos: Diplomado, Curso, Taller, etc.
 */
@Controller('tipos-programa')
@UseGuards(JwtAuthGuard)
export class TiposProgramaController {
  constructor(private readonly tiposProgramaService: TiposProgramaService) {}

  /**
   * POST /tipos-programa
   * Crear un nuevo tipo de programa
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateTipoProgramaDto) {
    return this.tiposProgramaService.create(createDto);
  }

  /**
   * GET /tipos-programa
   * Listar todos los tipos
   */
  @Get()
  findAll() {
    return this.tiposProgramaService.findAll();
  }

  /**
   * GET /tipos-programa/activos
   * Listar solo tipos activos
   */
  @Get('activos')
  findAllActive() {
    return this.tiposProgramaService.findAllActive();
  }

  /**
   * GET /tipos-programa/:id
   * Obtener un tipo por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposProgramaService.findOne(+id);
  }

  /**
   * PATCH /tipos-programa/:id
   * Actualizar un tipo
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateTipoProgramaDto) {
    return this.tiposProgramaService.update(+id, updateDto);
  }

  /**
   * PATCH /tipos-programa/:id/toggle
   * Activar/Desactivar un tipo
   */
  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string) {
    return this.tiposProgramaService.toggleActive(+id);
  }

  /**
   * DELETE /tipos-programa/:id
   * Eliminar un tipo
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tiposProgramaService.remove(+id);
  }
}
