import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';

@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  create(@Body() createNotaDto: CreateNotaDto) {
    return this.notasService.create(createNotaDto);
  }

  @Post('grupales')
  registrarNotasGrupales(
    @Body()
    body: {
      unidadId: number;
      notas: Array<{ inscripcionId: number; nota: number; observaciones?: string }>;
      userCreaId?: number;
    },
  ) {
    return this.notasService.registrarNotasGrupales(body.unidadId, body.notas, body.userCreaId);
  }

  @Get()
  findAll() {
    return this.notasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notasService.findOne(id);
  }

  @Get('inscripcion/:inscripcionId')
  findByInscripcion(@Param('inscripcionId', ParseIntPipe) inscripcionId: number) {
    return this.notasService.findByInscripcion(inscripcionId);
  }

  @Get('inscripcion/:inscripcionId/nota-final')
  calcularNotaFinal(@Param('inscripcionId', ParseIntPipe) inscripcionId: number) {
    return this.notasService.calcularNotaFinal(inscripcionId);
  }

  @Get('unidad/:unidadId')
  findByUnidad(@Param('unidadId', ParseIntPipe) unidadId: number) {
    return this.notasService.findByUnidad(unidadId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNotaDto: UpdateNotaDto) {
    return this.notasService.update(id, updateNotaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notasService.remove(id);
  }
}
