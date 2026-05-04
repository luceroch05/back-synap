import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionesCertificadoService } from './configuraciones-certificado.service';
import { ConfiguracionesCertificadoController } from './configuraciones-certificado.controller';
import { ConfiguracionCertificado } from './entities/configuracion-certificado.entity';
import { ConfiguracionLogo } from './entities/configuracion-logo.entity';
import { ConfiguracionFirma } from './entities/configuracion-firma.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConfiguracionCertificado,
      ConfiguracionLogo,
      ConfiguracionFirma,
    ]),
  ],
  controllers: [ConfiguracionesCertificadoController],
  providers: [ConfiguracionesCertificadoService],
  exports: [ConfiguracionesCertificadoService],
})
export class ConfiguracionesCertificadoModule {}
