# Backend SYNAP - Proyecto de Titulación

Backend desarrollado con **NestJS 11**, **TypeORM** y **MySQL** para el proyecto de certificados SYNAP.

## Tecnologías Implementadas

- **NestJS 11**: Framework de Node.js para aplicaciones del lado del servidor
- **TypeORM**: ORM para trabajar con bases de datos
- **MySQL**: Base de datos relacional
- **class-validator**: Validación de datos
- **@nestjs/config**: Manejo de variables de entorno

## Estructura del Proyecto

```
src/
├── modules/              # Módulos de la aplicación
│   └── users/           # Módulo de ejemplo (Users)
│       ├── entities/    # Entidades de base de datos
│       ├── dto/         # Data Transfer Objects (validación)
│       ├── users.controller.ts   # Rutas HTTP
│       ├── users.service.ts      # Lógica de negocio
│       └── users.module.ts       # Configuración del módulo
├── app.module.ts        # Módulo principal
└── main.ts             # Punto de entrada
```

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tus valores:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
# Desarrollo
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=synap_db
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Crear la base de datos

Entra a MySQL y crea la base de datos:

```sql
CREATE DATABASE synap_db;
```

### 4. Ejecutar el proyecto

```bash
# Desarrollo (con hot-reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor estará corriendo en `http://localhost:3001`

## Cambiar entre Desarrollo y Producción

### En el archivo `.env`:

**Desarrollo:**
```env
PORT=3001
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=synap_db
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Producción (descomenta y configura):**
```env
PORT=3001
DB_HOST=tu-servidor-produccion.com
DB_USERNAME=usuario_prod
DB_PASSWORD=password_seguro_prod
DB_DATABASE=synap_db_prod
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.com
```

## Arquitectura - Cómo Crear un Nuevo Módulo

### Paso 1: Crear la estructura de carpetas

```bash
mkdir -p src/modules/mi-modulo/entities
mkdir -p src/modules/mi-modulo/dto
```

### Paso 2: Crear la Entidad

`src/modules/mi-modulo/entities/mi-entidad.entity.ts`

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('nombre_tabla')
export class MiEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
}
```

### Paso 3: Crear los DTOs

`src/modules/mi-modulo/dto/create-mi-entidad.dto.ts`

```typescript
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMiEntidadDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
```

### Paso 4: Crear el Servicio

`src/modules/mi-modulo/mi-modulo.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MiEntidad } from './entities/mi-entidad.entity';

@Injectable()
export class MiModuloService {
  constructor(
    @InjectRepository(MiEntidad)
    private readonly repository: Repository<MiEntidad>,
  ) {}

  async findAll() {
    return await this.repository.find();
  }
}
```

### Paso 5: Crear el Controlador

`src/modules/mi-modulo/mi-modulo.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { MiModuloService } from './mi-modulo.service';

@Controller('mi-modulo')
export class MiModuloController {
  constructor(private readonly service: MiModuloService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
```

### Paso 6: Crear el Módulo

`src/modules/mi-modulo/mi-modulo.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiModuloService } from './mi-modulo.service';
import { MiModuloController } from './mi-modulo.controller';
import { MiEntidad } from './entities/mi-entidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MiEntidad])],
  controllers: [MiModuloController],
  providers: [MiModuloService],
  exports: [MiModuloService],
})
export class MiModuloModule {}
```

### Paso 7: Registrar en app.module.ts

```typescript
import { MiModuloModule } from './modules/mi-modulo/mi-modulo.module';

@Module({
  imports: [
    // ... otras importaciones
    MiModuloModule,
  ],
})
export class AppModule {}
```

## Endpoints del Módulo Users (Ejemplo)

- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener un usuario por ID
- `POST /users` - Crear un usuario
- `PATCH /users/:id` - Actualizar un usuario
- `DELETE /users/:id` - Eliminar un usuario

### Ejemplo de petición POST:

```json
{
  "email": "usuario@ejemplo.com",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

## Conceptos Importantes

### Entity (Entidad)
Representa una tabla en la base de datos. Cada propiedad es una columna.

### DTO (Data Transfer Object)
Valida los datos que llegan del frontend. Usa decoradores de `class-validator`.

### Service (Servicio)
Contiene la lógica de negocio. Interactúa con la base de datos.

### Controller (Controlador)
Define las rutas HTTP y conecta las peticiones con los servicios.

### Module (Módulo)
Agrupa entities, services, y controllers relacionados.

## Buenas Prácticas

1. **Siempre valida los datos** con DTOs
2. **Separa la lógica de negocio** en servicios
3. **Usa transacciones** para operaciones múltiples
4. **Maneja errores** con excepciones de NestJS
5. **Documenta tu código** con comentarios
6. **No expongas datos sensibles** en las respuestas

## Scripts Disponibles

```bash
npm run start:dev    # Desarrollo con hot-reload
npm run build        # Compilar para producción
npm run start:prod   # Ejecutar en producción
npm run lint         # Linter
npm run format       # Formatear código
```

## Notas Importantes

- **TypeORM synchronize**: Está activado solo en desarrollo. En producción usa migraciones.
- **CORS**: Está configurado para aceptar peticiones del frontend
- **Validación Global**: Todas las peticiones son validadas automáticamente

## Para Producción

1. Cambia `NODE_ENV=production` en `.env`
2. Configura las credenciales de la base de datos de producción
3. Desactiva `synchronize` (ya está configurado automáticamente)
4. Usa un gestor de procesos como PM2:

```bash
npm install -g pm2
npm run build
pm2 start dist/main.js --name synap-backend
```

---

**Proyecto desarrollado para titulación - SYNAP**
