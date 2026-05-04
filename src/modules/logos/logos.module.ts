import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogosService } from './logos.service';
import { LogosController } from './logos.controller';
import { Logo } from './entities/logo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Logo])],
  controllers: [LogosController],
  providers: [LogosService],
  exports: [LogosService],
})
export class LogosModule {}
