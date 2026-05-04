import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { Nota } from './entities/nota.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Unidad } from '../unidades/entities/unidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nota, Inscripcion, Unidad])],
  controllers: [NotasController],
  providers: [NotasService],
  exports: [NotasService],
})
export class NotasModule {}
