import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConfiguracionCertificado } from './configuracion-certificado.entity';
import { Firma } from '../../firmas/entities/firma.entity';

/**
 * Entidad ConfiguracionFirma
 * Tabla intermedia: asocia firmas a una configuración de certificado
 */
@Entity('configuracion_firmas')
export class ConfiguracionFirma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'configuracion_id' })
  configuracionId: number;

  @ManyToOne(() => ConfiguracionCertificado, (config) => config.firmas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'configuracion_id' })
  configuracion: ConfiguracionCertificado;

  @Column({ name: 'firma_id' })
  firmaId: number;

  @ManyToOne(() => Firma, { eager: true })
  @JoinColumn({ name: 'firma_id' })
  firma: Firma;
}
