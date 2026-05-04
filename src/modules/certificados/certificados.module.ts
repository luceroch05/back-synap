import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificadosService } from './certificados.service';
import { CertificadosController } from './certificados.controller';
import { Certificado } from './entities/certificado.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { ConfiguracionesCertificadoModule } from '../configuraciones-certificado/configuraciones-certificado.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificado, Inscripcion]),
    ConfiguracionesCertificadoModule,
  ],
  controllers: [CertificadosController],
  providers: [CertificadosService, PdfGeneratorService],
  exports: [CertificadosService, PdfGeneratorService],
})
export class CertificadosModule {}
