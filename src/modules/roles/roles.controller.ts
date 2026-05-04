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
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * Controlador de Roles
 * Endpoints para gestión de roles
 * Solo accesible para usuarios autenticados
 */
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * POST /roles
   * Crear un nuevo rol
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

  /**
   * GET /roles
   * Listar todos los roles
   */
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * GET /roles/:id
   * Obtener un rol por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  /**
   * PATCH /roles/:id
   * Actualizar un rol
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto) {
    return this.rolesService.update(+id, updateRolDto);
  }

  /**
   * DELETE /roles/:id
   * Eliminar un rol
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
