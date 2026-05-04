import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

/**
 * DTO para crear una inscripción
 */
export class CreateInscripcionDto {
  @IsInt()
  @IsNotEmpty({ message: 'El participante es requerido' })
  participanteId: number;

  @IsInt()
  @IsNotEmpty({ message: 'El grupo es requerido' })
  grupoId: number;

  @IsInt()
  @IsNotEmpty({ message: 'El estado es requerido' })
  estadoId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'La fecha de inscripción es requerida' })
  fechaInscripcion: string;
}
