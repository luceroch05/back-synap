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
import { FirmasService } from './firmas.service';
import { CreateFirmaDto } from './dto/create-firma.dto';
import { UpdateFirmaDto } from './dto/update-firma.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('firmas')
@UseGuards(JwtAuthGuard)
export class FirmasController {
  constructor(private readonly firmasService: FirmasService) {}

  @Post()
  create(@Body() createFirmaDto: CreateFirmaDto, @Request() req) {
    return this.firmasService.create(createFirmaDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.firmasService.findAll();
  }

  @Get('activos')
  findAllActive() {
    return this.firmasService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firmasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFirmaDto: UpdateFirmaDto,
    @Request() req,
  ) {
    return this.firmasService.update(+id, updateFirmaDto, req.user.userId);
  }

  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string, @Request() req) {
    return this.firmasService.toggleActive(+id, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.firmasService.remove(+id);
  }
}
