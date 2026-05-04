import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosInscripcionService } from './estados-inscripcion.service';
import { EstadosInscripcionController } from './estados-inscripcion.controller';
import { EstadoInscripcion } from './entities/estado-inscripcion.entity';

/**
 * Módulo de Estados de Inscripción
 * Catálogo de estados para las inscripciones
 */
@Module({
  imports: [TypeOrmModule.forFeature([EstadoInscripcion])],
  controllers: [EstadosInscripcionController],
  providers: [EstadosInscripcionService],
  exports: [EstadosInscripcionService],
})
export class EstadosInscripcionModule {}
