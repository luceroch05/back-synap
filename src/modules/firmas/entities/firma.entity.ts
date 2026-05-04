import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

/**
 * Entidad Firma
 * Almacena firmas de autoridades para certificados
 */
@Entity('firmas')
export class Firma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_autoridad', type: 'varchar', length: 100 })
  nombreAutoridad: string;

  @Column({ type: 'varchar', length: 100 })
  cargo: string;

  @Column({ name: 'imagen_firma', type: 'longtext' })
  imagenFirma: string;

  @Column({ type: 'tinyint', default: 1 })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'user_crea_id', nullable: true })
  userCreaId: number;

  @ManyToOne(() => Usuario, { eager: false })
  @JoinColumn({ name: 'user_crea_id' })
  userCrea: Usuario;

  @Column({ name: 'user_actualiza_id', nullable: true })
  userActualizaId: number;

  @ManyToOne(() => Usuario, { eager: false })
  @JoinColumn({ name: 'user_actualiza_id' })
  userActualiza: Usuario;
}
