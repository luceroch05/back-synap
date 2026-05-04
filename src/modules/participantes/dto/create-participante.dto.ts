import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO para crear un participante
 */
export class CreateParticipanteDto {
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
}
