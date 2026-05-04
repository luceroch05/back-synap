import { IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO para crear un rol
 */
export class CreateRolDto {
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;
}
