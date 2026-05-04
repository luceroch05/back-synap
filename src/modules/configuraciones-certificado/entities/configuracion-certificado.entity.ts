import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Programa } from '../../programas/entities/programa.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { ConfiguracionLogo } from './configuracion-logo.entity';
import { ConfiguracionFirma } from './configuracion-firma.entity';

/**
 * Entidad ConfiguracionCertificado
 * Configura la plantilla de certificado para un programa específico
 */
@Entity('configuraciones_certificado')
export class ConfiguracionCertificado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'programa_id' })
  programaId: number;

  @ManyToOne(() => Programa, { eager: true })
  @JoinColumn({ name: 'programa_id' })
  programa: Programa;

  @Column({ name: 'plantilla_url', type: 'longtext', nullable: true })
  plantillaUrl: string;

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

  // Relaciones con logos y firmas
  @OneToMany(() => ConfiguracionLogo, (configLogo) => configLogo.configuracion, {
    cascade: true,
  })
  logos: ConfiguracionLogo[];

  @OneToMany(() => ConfiguracionFirma, (configFirma) => configFirma.configuracion, {
    cascade: true,
  })
  firmas: ConfiguracionFirma[];
}
