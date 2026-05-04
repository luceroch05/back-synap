import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramasService } from './programas.service';
import { ProgramasController } from './programas.controller';
import { Programa } from './entities/programa.entity';
import { TiposProgramaModule } from '../tipos-programa/tipos-programa.module';

/**
 * Módulo de Programas
 * Gestión de programas académicos
 */
@Module({
  imports: [TypeOrmModule.forFeature([Programa]), TiposProgramaModule],
  controllers: [ProgramasController],
  providers: [ProgramasService],
  exports: [ProgramasService],
})
export class ProgramasModule {}
