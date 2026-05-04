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
} from '@nestjs/common';
import { ConfiguracionesCertificadoService } from './configuraciones-certificado.service';
import { CreateConfiguracionCertificadoDto } from './dto/create-configuracion-certificado.dto';
import { UpdateConfiguracionCertificadoDto } from './dto/update-configuracion-certificado.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('configuraciones-certificado')
@UseGuards(JwtAuthGuard)
export class ConfiguracionesCertificadoController {
  constructor(
    private readonly configuracionesService: ConfiguracionesCertificadoService,
  ) {}

  @Post()
  create(
    @Body() createDto: CreateConfiguracionCertificadoDto,
    @Request() req,
  ) {
    return this.configuracionesService.create(createDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.configuracionesService.findAll();
  }

  @Get('activos')
  findAllActive() {
    return this.configuracionesService.findAllActive();
  }

  @Get('programa/:programaId')
  findByPrograma(@Param('programaId') programaId: string) {
    return this.configuracionesService.findByPrograma(+programaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configuracionesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateConfiguracionCertificadoDto,
    @Request() req,
  ) {
    return this.configuracionesService.update(+id, updateDto, req.user.userId);
  }

  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string, @Request() req) {
    return this.configuracionesService.toggleActive(+id, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.configuracionesService.remove(+id);
  }
}
