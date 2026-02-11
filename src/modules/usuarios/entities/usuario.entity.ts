import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad Usuario - representa la tabla 'usuarios' en la base de datos
 * Almacena usuarios del sistema (Administrador y Admisión)
 */
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  usuario: string;

  @Column({ unique: true })
  correo: string;

  @Column({ select: false }) // No mostrar en consultas por seguridad
  contrasena: string;

  @Column({ name: 'rol_id' })
  rolId: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
