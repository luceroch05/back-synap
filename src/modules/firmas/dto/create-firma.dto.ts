import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFirmaDto {
  @IsString()
  @MaxLength(100)
  nombreAutoridad: string;

  @IsString()
  @MaxLength(100)
  cargo: string;

  @IsString()
  imagenFirma: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  activo?: boolean;
}
