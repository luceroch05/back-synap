import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';

/**
 * Entidad EstadoInscripcion
 * Catálogo de estados de inscripción (ej: Inscrito, Aprobado, Retirado, etc.)
 */
@Entity('estado_inscripcion')
export class EstadoInscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  // Relación con inscripciones
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.estado)
  inscripciones: Inscripcion[];
}
