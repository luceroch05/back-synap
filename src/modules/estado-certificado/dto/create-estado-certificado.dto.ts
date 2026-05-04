import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateEstadoCertificadoDto {
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}
