import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * DTO para crear un programa
 */
export class CreateProgramaDto {
  @IsNumber()
  tipoProgramaId: number;

  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(1)
  horasAcademicas: number;

  @IsBoolean()
  @IsOptional()
  tieneEvaluacion?: boolean;

  @IsNumber()
  @IsOptional()
  notaMinimaAprobatoria?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
