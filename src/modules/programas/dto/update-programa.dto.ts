import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramaDto } from './create-programa.dto';

/**
 * DTO para actualizar un programa
 * Todos los campos son opcionales
 */
export class UpdateProgramaDto extends PartialType(CreateProgramaDto) {}
