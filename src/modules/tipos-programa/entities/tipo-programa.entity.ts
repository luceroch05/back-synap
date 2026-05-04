import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Programa } from '../../programas/entities/programa.entity';

/**
 * Entidad TipoPrograma
 * Tabla: tipos_programa
 * Ejemplos: Diplomado, Curso, Taller, Seminario
 */
@Entity('tipos_programa')
export class TipoPrograma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // Relaciones
  @OneToMany(() => Programa, (programa) => programa.tipoPrograma)
  programas: Programa[];
}
