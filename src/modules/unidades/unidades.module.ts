import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadesService } from './unidades.service';
import { UnidadesController } from './unidades.controller';
import { Unidad } from './entities/unidad.entity';
import { Programa } from '../programas/entities/programa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Unidad, Programa])],
  controllers: [UnidadesController],
  providers: [UnidadesService],
  exports: [UnidadesService],
})
export class UnidadesModule {}
