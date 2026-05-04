import { IsInt, IsOptional, IsArray } from 'class-validator';

/**
 * DTO para generar un certificado individual
 */
export class GenerarCertificadoDto {
  @IsInt()
  inscripcionId: number;

  @IsInt()
  programaId: number;
}

/**
 * DTO para generar certificados masivos
 */
export class GenerarCertificadosMasivosDto {
  @IsArray()
  @IsInt({ each: true })
  inscripcionesIds: number[];

  @IsInt()
  programaId: number;
}
