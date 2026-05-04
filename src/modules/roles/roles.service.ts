import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

/**
 * Servicio de Roles
 * Maneja la lógica de negocio de roles
 */
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  /**
   * Crear un nuevo rol
   */
  async create(createRolDto: CreateRolDto): Promise<Rol> {
    // Verificar si el rol ya existe
    const existente = await this.rolRepository.findOne({
      where: { nombre: createRolDto.nombre },
    });

    if (existente) {
      throw new ConflictException(
        `El rol '${createRolDto.nombre}' ya existe`,
      );
    }

    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }

  /**
   * Obtener todos los roles
   */
  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find({
      order: { id: 'ASC' },
    });
  }

  /**
   * Obtener un rol por ID
   */
  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { id },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  /**
   * Actualizar un rol
   */
  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otro con ese nombre
    if (updateRolDto.nombre && updateRolDto.nombre !== rol.nombre) {
      const existente = await this.rolRepository.findOne({
        where: { nombre: updateRolDto.nombre },
      });

      if (existente) {
        throw new ConflictException(
          `El rol '${updateRolDto.nombre}' ya existe`,
        );
      }
    }

    Object.assign(rol, updateRolDto);
    return await this.rolRepository.save(rol);
  }

  /**
   * Eliminar un rol
   */
  async remove(id: number): Promise<void> {
    const rol = await this.findOne(id);

    // Verificar que no sea un rol del sistema (1: Administrador, 2: Admisión)
    if (id === 1 || id === 2) {
      throw new ConflictException('No se pueden eliminar roles del sistema');
    }

    await this.rolRepository.remove(rol);
  }
}
