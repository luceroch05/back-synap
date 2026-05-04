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
import { EstadosInscripcionService } from './estados-inscripcion.service';
import { CreateEstadoInscripcionDto } from './dto/create-estado-inscripcion.dto';
import { UpdateEstadoInscripcionDto } from './dto/update-estado-inscripcion.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Controlador de Estados de Inscripción
 * Endpoints para gestionar estados de inscripción
 */
@Controller('estados-inscripcion')
@UseGuards(JwtAuthGuard)
export class EstadosInscripcionController {
  constructor(
    private readonly estadosInscripcionService: EstadosInscripcionService,
  ) {}

  /**
   * POST /estados-inscripcion
   * Crear un nuevo estado de inscripción
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateEstadoInscripcionDto) {
    return this.estadosInscripcionService.create(createDto);
  }

  /**
   * GET /estados-inscripcion
   * Listar todos los estados de inscripción
   */
  @Get()
  findAll() {
    return this.estadosInscripcionService.findAll();
  }

  /**
   * GET /estados-inscripcion/:id
   * Obtener un estado de inscripción por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosInscripcionService.findOne(+id);
  }

  /**
   * PATCH /estados-inscripcion/:id
   * Actualizar un estado de inscripción
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateEstadoInscripcionDto,
  ) {
    return this.estadosInscripcionService.update(+id, updateDto);
  }

  /**
   * DELETE /estados-inscripcion/:id
   * Eliminar un estado de inscripción
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.estadosInscripcionService.remove(+id);
  }
}
