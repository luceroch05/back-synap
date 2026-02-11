import { IsEmail, IsNotEmpty, IsString, IsNumber, MinLength } from 'class-validator';

/**
 * DTO para crear un usuario
 */
export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El usuario debe tener al menos 3 caracteres' })
  usuario: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;

  @IsNumber()
  rolId: number;
}
