import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposProgramaService } from './tipos-programa.service';
import { TiposProgramaController } from './tipos-programa.controller';
import { TipoPrograma } from './entities/tipo-programa.entity';

/**
 * Módulo de Tipos de Programa
 * Gestión de tipos: Diplomado, Curso, Taller, Seminario, etc.
 */
@Module({
  imports: [TypeOrmModule.forFeature([TipoPrograma])],
  controllers: [TiposProgramaController],
  providers: [TiposProgramaService],
  exports: [TiposProgramaService],
})
export class TiposProgramaModule {}
