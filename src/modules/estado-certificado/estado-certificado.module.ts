import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoCertificadoService } from './estado-certificado.service';
import { EstadoCertificadoController } from './estado-certificado.controller';
import { EstadoCertificado } from './entities/estado-certificado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstadoCertificado])],
  controllers: [EstadoCertificadoController],
  providers: [EstadoCertificadoService],
  exports: [EstadoCertificadoService],
})
export class EstadoCertificadoModule {}
