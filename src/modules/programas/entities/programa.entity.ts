import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TipoPrograma } from '../../tipos-programa/entities/tipo-programa.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { GrupoProgramas } from '../../grupos-programas/entities/grupo-programa.entity';
import { Unidad } from '../../unidades/entities/unidad.entity';

/**
 * Entidad Programa
 * Tabla: programas
 * Programas académicos: Diplomados, Cursos, Talleres, etc.
 */
@Entity('programas')
export class Programa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tipo_programa_id' })
  tipoProgramaId: number;

  @ManyToOne(() => TipoPrograma, (tipo) => tipo.programas, { eager: true })
  @JoinColumn({ name: 'tipo_programa_id' })
  tipoPrograma: TipoPrograma;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'horas_academicas', type: 'int' })
  horasAcademicas: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ name: 'tiene_evaluacion', type: 'boolean', default: false })
  tieneEvaluacion: boolean;

  @Column({ name: 'nota_minima_aprobatoria', type: 'decimal', precision: 5, scale: 2, default: 13.00 })
  notaMinimaAprobatoria: number;

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

  // Relación con grupos
  @OneToMany(() => GrupoProgramas, (grupo) => grupo.programa)
  grupos: GrupoProgramas[];

  // Relación con unidades
  @OneToMany(() => Unidad, (unidad) => unidad.programa)
  unidades: Unidad[];
}
