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
} from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Controlador de Programas
 * Endpoints para gestionar programas académicos
 */
@Controller('programas')
@UseGuards(JwtAuthGuard)
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) {}

  /**
   * POST /programas
   * Crear un nuevo programa
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateProgramaDto, @Request() req) {
    return this.programasService.create(createDto, req.user.id);
  }

  /**
   * GET /programas
   * Listar todos los programas
   */
  @Get()
  findAll() {
    return this.programasService.findAll();
  }

  /**
   * GET /programas/activos
   * Listar solo programas activos
   */
  @Get('activos')
  findAllActive() {
    return this.programasService.findAllActive();
  }

  /**
   * GET /programas/:id
   * Obtener un programa por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programasService.findOne(+id);
  }

  /**
   * PATCH /programas/:id
   * Actualizar un programa
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProgramaDto,
    @Request() req,
  ) {
    return this.programasService.update(+id, updateDto, req.user.id);
  }

  /**
   * PATCH /programas/:id/toggle
   * Activar/Desactivar un programa
   */
  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string, @Request() req) {
    return this.programasService.toggleActive(+id, req.user.id);
  }

  /**
   * DELETE /programas/:id
   * Eliminar un programa
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.programasService.remove(+id);
  }
}
