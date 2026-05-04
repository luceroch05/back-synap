import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoProgramaDto } from './create-tipo-programa.dto';

/**
 * DTO para actualizar un tipo de programa
 * Todos los campos son opcionales
 */
export class UpdateTipoProgramaDto extends PartialType(CreateTipoProgramaDto) {}
