import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

/**
 * Estrategia JWT
 * Valida tokens JWT en peticiones protegidas
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET') || 'secret-key-synap-2024',
    });
  }

  async validate(payload: any) {
    const usuario = await this.authService.validateUser(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException();
    }

    return usuario;
  }
}
