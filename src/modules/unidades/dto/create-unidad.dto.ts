import { IsNotEmpty, IsString, IsInt, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateUnidadDto {
  @IsNotEmpty({ message: 'El ID del programa es obligatorio' })
  @IsInt({ message: 'El ID del programa debe ser un número entero' })
  programaId: number;

  @IsNotEmpty({ message: 'El nombre de la unidad es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsNotEmpty({ message: 'El orden es obligatorio' })
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(1, { message: 'El orden debe ser mayor o igual a 1' })
  orden: number;

  @IsNotEmpty({ message: 'El peso es obligatorio' })
  @IsNumber({}, { message: 'El peso debe ser un número' })
  @Min(0, { message: 'El peso debe ser mayor o igual a 0' })
  @Max(100, { message: 'El peso no puede ser mayor a 100' })
  peso: number;

  @IsOptional()
  @IsInt()
  userCreaId?: number;
}
