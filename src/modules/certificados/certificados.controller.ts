import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CertificadosService } from './certificados.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('certificados')
export class CertificadosController {
  constructor(private readonly certificadosService: CertificadosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDto: CreateCertificadoDto, @Request() req) {
    return this.certificadosService.create(createDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('estadoId') estadoId?: string,
    @Query('participanteId') participanteId?: string,
    @Query('programaId') programaId?: string,
  ) {
    if (estadoId) return this.certificadosService.findByEstado(+estadoId);
    if (participanteId) return this.certificadosService.findByParticipante(+participanteId);
    if (programaId) return this.certificadosService.findByPrograma(+programaId);
    return this.certificadosService.findAll();
  }

  // Ruta pública — sin JWT para validación externa
  @Get('codigo/:codigoUnico')
  findByCodigoUnico(@Param('codigoUnico') codigoUnico: string) {
    return this.certificadosService.findByCodigoUnico(codigoUnico);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.certificadosService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateDto: UpdateCertificadoDto, @Request() req) {
    return this.certificadosService.update(+id, updateDto, req.user.userId);
  }

  @Patch(':id/anular')
  @UseGuards(JwtAuthGuard)
  anular(@Param('id') id: string, @Body('motivo') motivo: string, @Request() req) {
    return this.certificadosService.anular(+id, motivo, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.certificadosService.remove(+id);
  }

  @Post('generar')
  @UseGuards(JwtAuthGuard)
  generarCertificado(
    @Body() dto: import('./dto/generar-certificado.dto').GenerarCertificadoDto,
    @Request() req,
  ) {
    return this.certificadosService.generarCertificado(dto, req.user.userId);
  }

  @Post('generar-masivo')
  @UseGuards(JwtAuthGuard)
  generarCertificadosMasivos(
    @Body() dto: import('./dto/generar-certificado.dto').GenerarCertificadosMasivosDto,
    @Request() req,
  ) {
    return this.certificadosService.generarCertificadosMasivos(dto, req.user.userId);
  }
}
