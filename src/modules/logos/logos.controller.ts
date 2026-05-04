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
import { LogosService } from './logos.service';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('logos')
@UseGuards(JwtAuthGuard)
export class LogosController {
  constructor(private readonly logosService: LogosService) {}

  @Post()
  create(@Body() createLogoDto: CreateLogoDto, @Request() req) {
    return this.logosService.create(createLogoDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.logosService.findAll();
  }

  @Get('activos')
  findAllActive() {
    return this.logosService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLogoDto: UpdateLogoDto,
    @Request() req,
  ) {
    return this.logosService.update(+id, updateLogoDto, req.user.userId);
  }

  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string, @Request() req) {
    return this.logosService.toggleActive(+id, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.logosService.remove(+id);
  }
}
