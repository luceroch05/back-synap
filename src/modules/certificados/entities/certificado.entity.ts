import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';
import { EstadoCertificado } from '../../estado-certificado/entities/estado-certificado.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

/**
 * Entidad Certificado
 * Representa un certificado emitido a un participante
 */
@Entity('certificados')
export class Certificado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'inscripcion_id' })
  inscripcionId: number;

  @ManyToOne(() => Inscripcion, { eager: true })
  @JoinColumn({ name: 'inscripcion_id' })
  inscripcion: Inscripcion;

  @Column({ name: 'codigo_unico', type: 'varchar', length: 100, unique: true })
  codigoUnico: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ name: 'fecha_emision', type: 'date' })
  fechaEmision: Date;

  @Column({ name: 'estado_id' })
  estadoId: number;

  @ManyToOne(() => EstadoCertificado, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoCertificado;

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

  /**
   * Genera un código único antes de insertar
   * Formato: CERT-YYYY-XXXXXXXX
   */
  @BeforeInsert()
  generarCodigoUnico() {
    if (!this.codigoUnico) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, '0');
      this.codigoUnico = `CERT-${year}-${random}`;
    }
  }
}
