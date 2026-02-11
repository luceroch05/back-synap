import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para login
 * Acepta usuario o correo
 */
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  usuario: string; // Puede ser usuario o correo

  @IsString()
  @IsNotEmpty()
  contrasena: string;
}
