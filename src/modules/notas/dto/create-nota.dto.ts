import { IsNotEmpty, IsInt, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateNotaDto {
  @IsNotEmpty({ message: 'El ID de la inscripción es obligatorio' })
  @IsInt({ message: 'El ID de la inscripción debe ser un número entero' })
  inscripcionId: number;

  @IsNotEmpty({ message: 'El ID de la unidad es obligatorio' })
  @IsInt({ message: 'El ID de la unidad debe ser un número entero' })
  unidadId: number;

  @IsNotEmpty({ message: 'La nota es obligatoria' })
  @IsNumber({}, { message: 'La nota debe ser un número' })
  @Min(0, { message: 'La nota debe ser mayor o igual a 0' })
  @Max(20, { message: 'La nota no puede ser mayor a 20' })
  nota: number;

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;

  @IsOptional()
  @IsInt()
  userCreaId?: number;
}
