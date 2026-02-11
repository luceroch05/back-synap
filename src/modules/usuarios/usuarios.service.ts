import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

/**
 * Servicio de Usuarios
 * Maneja la lógica de negocio de usuarios
 */
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * Crear un nuevo usuario
   */
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si el usuario ya existe
    const existeUsuario = await this.usuarioRepository.findOne({
      where: { usuario: createUsuarioDto.usuario },
    });

    if (existeUsuario) {
      throw new ConflictException('El usuario ya está registrado');
    }

    // Verificar si el correo ya existe
    const existeCorreo = await this.usuarioRepository.findOne({
      where: { correo: createUsuarioDto.correo },
    });

    if (existeCorreo) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasena, 10);

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      contrasena: hashedPassword,
    });

    return await this.usuarioRepository.save(usuario);
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtener un usuario por ID
   */
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  /**
   * Actualizar un usuario
   */
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Si se está actualizando el correo, verificar que no exista
    if (updateUsuarioDto.correo && updateUsuarioDto.correo !== usuario.correo) {
      const existe = await this.usuarioRepository.findOne({
        where: { correo: updateUsuarioDto.correo },
      });

      if (existe) {
        throw new ConflictException('El correo ya está registrado');
      }
    }

    // Si se está actualizando la contraseña, hashearla
    if (updateUsuarioDto.contrasena) {
      updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, 10);
    }

    Object.assign(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  /**
   * Eliminar un usuario
   */
  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
