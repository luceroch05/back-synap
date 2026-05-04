import { PartialType } from '@nestjs/mapped-types';
import { CreateRolDto } from './create-rol.dto';

/**
 * DTO para actualizar un rol
 * Todos los campos son opcionales
 */
export class UpdateRolDto extends PartialType(CreateRolDto) {}
