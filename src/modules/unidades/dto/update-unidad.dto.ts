import { PartialType } from '@nestjs/mapped-types';
import { CreateUnidadDto } from './create-unidad.dto';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdateUnidadDto extends PartialType(CreateUnidadDto) {
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un booleano' })
  activo?: boolean;

  @IsOptional()
  @IsInt()
  userActualizaId?: number;
}
