import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';

/**
 * Servicio de Autenticación
 * Maneja login y generación de tokens JWT
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Login de usuario
   * Acepta usuario o correo
   */
  async login(loginDto: LoginDto) {
    console.log('🔍 [LOGIN] Intentando login con:', loginDto.usuario);

    // Buscar por usuario o correo
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('(usuario.usuario = :usuario OR usuario.correo = :usuario) AND usuario.activo = :activo', {
        usuario: loginDto.usuario,
        activo: true,
      })
      .addSelect('usuario.contrasena')
      .getOne();

    console.log('🔍 [LOGIN] Usuario encontrado:', usuario ? usuario.usuario : 'NO ENCONTRADO');

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar contraseña
    console.log('🔐 [LOGIN] Validando contraseña...');
    const esValida = await bcrypt.compare(loginDto.contrasena, usuario.contrasena);
    console.log('🔐 [LOGIN] Contraseña válida:', esValida);

    if (!esValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload = {
      sub: usuario.id,
      usuario: usuario.usuario,
      rolId: usuario.rolId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        usuario: usuario.usuario,
        correo: usuario.correo,
        rolId: usuario.rolId,
      },
    };
  }

  /**
   * Validar token y retornar usuario
   */
  async validateUser(userId: number) {
    return await this.usuarioRepository.findOne({
      where: { id: userId, activo: true },
    });
  }
}
