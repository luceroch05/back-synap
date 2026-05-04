import { PartialType } from '@nestjs/mapped-types';
import { CreateInscripcionDto } from './create-inscripcion.dto';

/**
 * DTO para actualizar una inscripción
 */
export class UpdateInscripcionDto extends PartialType(CreateInscripcionDto) {}
