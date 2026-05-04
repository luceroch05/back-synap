import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Participante } from '../../participantes/entities/participante.entity';
import { GrupoProgramas } from '../../grupos-programas/entities/grupo-programa.entity';
import { EstadoInscripcion } from '../../estados-inscripcion/entities/estado-inscripcion.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Nota } from '../../notas/entities/nota.entity';

/**
 * Entidad Inscripcion
 * Inscripciones de participantes a grupos de programas
 */
@Entity('inscripciones')
@Unique(['participanteId', 'grupoId'])
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'participante_id' })
  participanteId: number;

  @Column({ name: 'grupo_id' })
  grupoId: number;

  @Column({ name: 'estado_id' })
  estadoId: number;

  @Column({ name: 'fecha_inscripcion', type: 'date' })
  fechaInscripcion: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'user_crea_id', nullable: true })
  userCreaId: number;

  @Column({ name: 'user_actualiza_id', nullable: true })
  userActualizaId: number;

  // Relaciones
  @ManyToOne(() => Participante, (participante) => participante.inscripciones)
  @JoinColumn({ name: 'participante_id' })
  participante: Participante;

  @ManyToOne(() => GrupoProgramas, (grupo) => grupo.inscripciones)
  @JoinColumn({ name: 'grupo_id' })
  grupo: GrupoProgramas;

  @ManyToOne(() => EstadoInscripcion, (estado) => estado.inscripciones)
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoInscripcion;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_crea_id' })
  userCrea: Usuario;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_actualiza_id' })
  userActualiza: Usuario;

  // Relación con notas
  @OneToMany(() => Nota, (nota) => nota.inscripcion)
  notas: Nota[];
}
