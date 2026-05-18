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
import { GruposProgramasService } from './grupos-programas.service';
import { CreateGrupoProgramaDto } from './dto/create-grupo-programa.dto';
import { UpdateGrupoProgramaDto } from './dto/update-grupo-programa.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Controlador de Grupos de Programas
 * Endpoints para gestionar grupos de programas
 */
@Controller('grupos-programas')
export class GruposProgramasController {
  constructor(
    private readonly gruposProgramasService: GruposProgramasService,
  ) {}

  /**
   * GET /grupos-programas/publicos
   * Listar grupos activos sin autenticación (para inscripción pública)
   */
  @Get('publicos')
  findPublicos() {
    return this.gruposProgramasService.findAllActive();
  }

  /**
   * POST /grupos-programas
   * Crear un nuevo grupo de programa
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateGrupoProgramaDto, @Request() req) {
    return this.gruposProgramasService.create(createDto, req.user.id);
  }

  /**
   * GET /grupos-programas
   * Listar todos los grupos de programas
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('programaId') programaId?: string) {
    if (programaId) {
      return this.gruposProgramasService.findByPrograma(+programaId);
    }
    return this.gruposProgramasService.findAll();
  }

  /**
   * GET /grupos-programas/activos
   * Listar solo grupos activos
   */
  @Get('activos')
  @UseGuards(JwtAuthGuard)
  findAllActive() {
    return this.gruposProgramasService.findAllActive();
  }

  /**
   * GET /grupos-programas/:id
   * Obtener un grupo por ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.gruposProgramasService.findOne(+id);
  }

  /**
   * PATCH /grupos-programas/:id
   * Actualizar un grupo de programa
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGrupoProgramaDto,
    @Request() req,
  ) {
    return this.gruposProgramasService.update(+id, updateDto, req.user.id);
  }

  /**
   * PATCH /grupos-programas/:id/toggle
   * Activar/Desactivar un grupo
   */
  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  toggleActive(@Param('id') id: string, @Request() req) {
    return this.gruposProgramasService.toggleActive(+id, req.user.id);
  }

  /**
   * DELETE /grupos-programas/:id
   * Eliminar un grupo de programa
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.gruposProgramasService.remove(+id);
  }
}
