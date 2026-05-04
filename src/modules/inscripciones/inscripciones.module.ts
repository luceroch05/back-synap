import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { Inscripcion } from './entities/inscripcion.entity';

/**
 * Módulo de Inscripciones
 * Gestión de inscripciones de participantes a grupos de programas
 */
@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion])],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
  exports: [InscripcionesService],
})
export class InscripcionesModule {}
