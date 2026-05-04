import { PartialType } from '@nestjs/mapped-types';
import { CreateNotaDto } from './create-nota.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateNotaDto extends PartialType(CreateNotaDto) {
  @IsOptional()
  @IsInt()
  userActualizaId?: number;
}
