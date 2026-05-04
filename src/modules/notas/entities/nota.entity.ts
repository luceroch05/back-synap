import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';
import { Unidad } from '../../unidades/entities/unidad.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

/**
 * Entidad Nota
 * Tabla: notas
 * Calificaciones de participantes por unidad
 */
@Entity('notas')
@Unique(['inscripcionId', 'unidadId'])
export class Nota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'inscripcion_id' })
  inscripcionId: number;

  @Column({ name: 'unidad_id' })
  unidadId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  nota: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'user_crea_id', nullable: true })
  userCreaId: number;

  @Column({ name: 'user_actualiza_id', nullable: true })
  userActualizaId: number;

  // Relaciones
  @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.notas)
  @JoinColumn({ name: 'inscripcion_id' })
  inscripcion: Inscripcion;

  @ManyToOne(() => Unidad, (unidad) => unidad.notas)
  @JoinColumn({ name: 'unidad_id' })
  unidad: Unidad;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_crea_id' })
  userCrea: Usuario;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_actualiza_id' })
  userActualiza: Usuario;
}
