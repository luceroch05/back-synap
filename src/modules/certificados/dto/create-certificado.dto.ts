import { IsInt, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCertificadoDto {
  @IsInt()
  inscripcionId: number;

  @IsOptional()
  @IsString()
  codigoUnico?: string;

  @IsDateString()
  fechaEmision: string;

  @IsInt()
  estadoId: number;
}
