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
import { Programa } from '../../programas/entities/programa.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Nota } from '../../notas/entities/nota.entity';

/**
 * Entidad Unidad
 * Tabla: unidades
 * Unidades/módulos de un programa académico con evaluación
 */
@Entity('unidades')
export class Unidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'programa_id' })
  programaId: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int' })
  orden: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  peso: number;

  @Column({ type: 'boolean', default: true })
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
  @ManyToOne(() => Programa, (programa) => programa.unidades)
  @JoinColumn({ name: 'programa_id' })
  programa: Programa;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_crea_id' })
  userCrea: Usuario;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'user_actualiza_id' })
  userActualiza: Usuario;

  @OneToMany(() => Nota, (nota) => nota.unidad)
  notas: Nota[];
}
