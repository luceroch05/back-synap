import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConfiguracionCertificado } from './configuracion-certificado.entity';
import { Logo } from '../../logos/entities/logo.entity';

/**
 * Entidad ConfiguracionLogo
 * Tabla intermedia: asocia logos a una configuración de certificado
 */
@Entity('configuracion_logos')
export class ConfiguracionLogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'configuracion_id' })
  configuracionId: number;

  @ManyToOne(() => ConfiguracionCertificado, (config) => config.logos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'configuracion_id' })
  configuracion: ConfiguracionCertificado;

  @Column({ name: 'logo_id' })
  logoId: number;

  @ManyToOne(() => Logo, { eager: true })
  @JoinColumn({ name: 'logo_id' })
  logo: Logo;
}
