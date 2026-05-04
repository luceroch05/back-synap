import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EstadoCertificadoService } from './estado-certificado.service';
import { CreateEstadoCertificadoDto } from './dto/create-estado-certificado.dto';
import { UpdateEstadoCertificadoDto } from './dto/update-estado-certificado.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('estado-certificado')
@UseGuards(JwtAuthGuard)
export class EstadoCertificadoController {
  constructor(
    private readonly estadoCertificadoService: EstadoCertificadoService,
  ) {}

  @Post()
  create(@Body() createDto: CreateEstadoCertificadoDto) {
    return this.estadoCertificadoService.create(createDto);
  }

  @Get()
  findAll() {
    return this.estadoCertificadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadoCertificadoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateEstadoCertificadoDto) {
    return this.estadoCertificadoService.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.estadoCertificadoService.remove(+id);
  }
}
