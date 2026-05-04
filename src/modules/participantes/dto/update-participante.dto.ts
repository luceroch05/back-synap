import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipanteDto } from './create-participante.dto';

/**
 * DTO para actualizar un participante
 * Todos los campos son opcionales
 */
export class UpdateParticipanteDto extends PartialType(CreateParticipanteDto) {}
