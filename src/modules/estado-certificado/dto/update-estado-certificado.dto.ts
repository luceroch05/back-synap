import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoCertificadoDto } from './create-estado-certificado.dto';

export class UpdateEstadoCertificadoDto extends PartialType(
  CreateEstadoCertificadoDto,
) {}
