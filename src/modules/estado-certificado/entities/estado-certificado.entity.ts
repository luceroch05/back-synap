import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Entidad EstadoCertificado
 * Catálogo de estados para certificados (Válido, Anulado, etc.)
 */
@Entity('estado_certificado')
export class EstadoCertificado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;
}
