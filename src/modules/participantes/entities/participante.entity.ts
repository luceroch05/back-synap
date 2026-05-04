import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';

/**
 * Entidad Participante
 * Tabla: participantes
 * Personas que participan en los programas de capacitación
 */
@Entity('participantes')
@Unique(['tipoDocumento', 'numeroDocumento'])
export class Participante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tipo_documento', type: 'varchar', length: 20 })
  tipoDocumento: string;

  @Column({ name: 'numero_documento', type: 'varchar', length: 20 })
  numeroDocumento: string;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  // Auditoría
  @Column({ name: 'user_crea_id', nullable: true })
  userCreaId: number;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_crea_id' })
  userCrea: Usuario;

  @Column({ name: 'user_actualiza_id', nullable: true })
  userActualizaId: number;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_actualiza_id' })
  userActualiza: Usuario;

  // Relación con inscripciones
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.participante)
  inscripciones: Inscripcion[];
}
