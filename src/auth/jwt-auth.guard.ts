import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard JWT
 * Protege rutas que requieren autenticación
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
