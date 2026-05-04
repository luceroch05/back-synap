import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GruposProgramasService } from './grupos-programas.service';
import { GruposProgramasController } from './grupos-programas.controller';
import { GrupoProgramas } from './entities/grupo-programa.entity';

/**
 * Módulo de Grupos de Programas
 * Gestión de grupos de programas con fechas y modalidad
 */
@Module({
  imports: [TypeOrmModule.forFeature([GrupoProgramas])],
  controllers: [GruposProgramasController],
  providers: [GruposProgramasService],
  exports: [GruposProgramasService],
})
export class GruposProgramasModule {}
