import { IsEmail, IsOptional, IsString, IsNumber, IsBoolean, MinLength } from 'class-validator';

/**
 * DTO para actualizar un usuario
 * Todos los campos son opcionales
 */
export class UpdateUsuarioDto {
  @IsString()
  @IsOptional()
  nombres?: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  usuario?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  contrasena?: string;

  @IsNumber()
  @IsOptional()
  rolId?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
