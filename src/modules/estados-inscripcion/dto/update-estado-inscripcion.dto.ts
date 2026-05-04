import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoInscripcionDto } from './create-estado-inscripcion.dto';

/**
 * DTO para actualizar un estado de inscripción
 */
export class UpdateEstadoInscripcionDto extends PartialType(
  CreateEstadoInscripcionDto,
) {}
