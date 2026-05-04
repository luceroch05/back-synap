import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantesService } from './participantes.service';
import { ParticipantesController } from './participantes.controller';
import { Participante } from './entities/participante.entity';

/**
 * Módulo de Participantes
 * Gestión de participantes del sistema
 */
@Module({
  imports: [TypeOrmModule.forFeature([Participante])],
  controllers: [ParticipantesController],
  providers: [ParticipantesService],
  exports: [ParticipantesService],
})
export class ParticipantesModule {}
