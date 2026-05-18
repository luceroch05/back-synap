import { IsString, IsEmail, IsOptional, MaxLength, IsInt, IsNotEmpty } from 'class-validator';

export class CreateInscripcionPublicaDto {
  @IsString()
  @MaxLength(20)
  tipoDocumento: string;

  @IsString()
  @MaxLength(20)
  numeroDocumento: string;

  @IsString()
  @MaxLength(100)
  nombres: string;

  @IsString()
  @MaxLength(100)
  apellidos: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @IsInt()
  @IsNotEmpty({ message: 'El grupo es requerido' })
  grupoId: number;
}
