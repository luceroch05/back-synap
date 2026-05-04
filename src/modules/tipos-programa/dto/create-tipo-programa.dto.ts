import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

/**
 * DTO para crear un tipo de programa
 */
export class CreateTipoProgramaDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
