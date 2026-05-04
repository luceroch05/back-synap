import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { TiposProgramaModule } from './modules/tipos-programa/tipos-programa.module';
import { ProgramasModule } from './modules/programas/programas.module';
import { ParticipantesModule } from './modules/participantes/participantes.module';
import { EstadosInscripcionModule } from './modules/estados-inscripcion/estados-inscripcion.module';
import { GruposProgramasModule } from './modules/grupos-programas/grupos-programas.module';
import { InscripcionesModule } from './modules/inscripciones/inscripciones.module';
import { LogosModule } from './modules/logos/logos.module';
import { FirmasModule } from './modules/firmas/firmas.module';
import { EstadoCertificadoModule } from './modules/estado-certificado/estado-certificado.module';
import { ConfiguracionesCertificadoModule } from './modules/configuraciones-certificado/configuraciones-certificado.module';
import { CertificadosModule } from './modules/certificados/certificados.module';
import { UploadModule } from './modules/upload/upload.module';
import { UnidadesModule } from './modules/unidades/unidades.module';
import { NotasModule } from './modules/notas/notas.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM con MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
  
      }),
      inject: [ConfigService],
    }),

    // Módulos
    AuthModule,
    UsuariosModule,
    RolesModule,
    TiposProgramaModule,
    ProgramasModule,
    ParticipantesModule,
    EstadosInscripcionModule,
    GruposProgramasModule,
    InscripcionesModule,
    LogosModule,
    FirmasModule,
    EstadoCertificadoModule,
    ConfiguracionesCertificadoModule,
    CertificadosModule,
    UploadModule,
    UnidadesModule,
    NotasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
