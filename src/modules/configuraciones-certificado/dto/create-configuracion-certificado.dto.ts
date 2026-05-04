import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class AsignarLogoDto {
  @IsInt()
  logoId: number;
}

export class AsignarFirmaDto {
  @IsInt()
  firmaId: number;
}

export class CreateConfiguracionCertificadoDto {
  @IsInt()
  programaId: number;

  @IsOptional()
  @IsString()
  plantillaUrl?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsignarLogoDto)
  logos?: AsignarLogoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AsignarFirmaDto)
  firmas?: AsignarFirmaDto[];
}
