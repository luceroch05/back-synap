import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Programa } from '../../programas/entities/programa.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';

/**
 * Enum para Modalidad de Grupo
 */
export enum ModalidadGrupo {
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
  MIXTA = 'MIXTA',
}

/**
 * Entidad GrupoProgramas
 * Grupos de programas con fechas y modalidad
 */
@Entity('grupos_programas')
export class GrupoProgramas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'programa_id' })
  programaId: number;

  @Column({ name: 'nombre_grupo', length: 100 })
  nombreGrupo: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @Column({
    type: 'enum',
    enum: ModalidadGrupo,
  })
  modalidad: ModalidadGrupo;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'user_crea_id', nullable: true })
  userCreaId: number;

  @Column({ name: 'user_actualiza_id', nullable: true })
  userActualizaId: number;

  // Relaciones
  @ManyToOne(() => Programa, (programa) => programa.grupos)
  @JoinColumn({ name: 'programa_id' })
  programa: Programa;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_crea_id' })
  userCrea: Usuario;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_actualiza_id' })
  userActualiza: Usuario;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.grupo)
  inscripciones: Inscripcion[];
}
