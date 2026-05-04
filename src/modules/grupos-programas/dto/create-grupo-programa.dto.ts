import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ModalidadGrupo } from '../entities/grupo-programa.entity';

/**
 * DTO para crear un grupo de programa
 */
export class CreateGrupoProgramaDto {
  @IsInt()
  @IsNotEmpty({ message: 'El programa es requerido' })
  programaId: number;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del grupo es requerido' })
  @MaxLength(100, {
    message: 'El nombre del grupo no puede exceder 100 caracteres',
  })
  nombreGrupo: string;

  @IsDateString()
  @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty({ message: 'La fecha de fin es requerida' })
  fechaFin: string;

  @IsEnum(ModalidadGrupo, {
    message: 'La modalidad debe ser PRESENCIAL, VIRTUAL o MIXTA',
  })
  @IsNotEmpty({ message: 'La modalidad es requerida' })
  modalidad: ModalidadGrupo;
}
