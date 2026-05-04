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
 * Entidad Logo
 * Almacena logos institucionales y de patrocinadores
 */
@Entity('logos')
export class Logo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre: string;

  @Column({ name: 'imagen_logo', type: 'longtext' })
  imagenLogo: string;

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
