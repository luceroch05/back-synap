import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoProgramaDto } from './create-grupo-programa.dto';

/**
 * DTO para actualizar un grupo de programa
 */
export class UpdateGrupoProgramaDto extends PartialType(
  CreateGrupoProgramaDto,
) {}
