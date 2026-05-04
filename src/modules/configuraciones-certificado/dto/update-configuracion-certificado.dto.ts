import { PartialType } from '@nestjs/mapped-types';
import { CreateConfiguracionCertificadoDto } from './create-configuracion-certificado.dto';

export class UpdateConfiguracionCertificadoDto extends PartialType(
  CreateConfiguracionCertificadoDto,
) {}
