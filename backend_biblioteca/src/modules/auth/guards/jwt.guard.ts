import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_ROUTE_KEY } from '@auth/constants';
import { ErrorCodeEnum } from '@auth/enums';
import { Request } from 'express';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  // 1. Manejo de excepciones personalizado evitando lanzar 401 en rutas públicas
  handleRequest<TUser = any>(
    err: Error | null,
    user: TUser | false,
    info: JsonWebTokenError | TokenExpiredError | Error | undefined,
    context?: ExecutionContext,
  ): TUser {
    // Si la ruta es pública, permitimos pasar sin usuario ni token
    if (context) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return user as TUser;
      }
    }

    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        error: ErrorCodeEnum.EXPIRED_TOKEN,
        message: ErrorCodeEnum.EXPIRED_TOKEN,
      });
    }

    if (err || !user) {
      throw new HttpException('Mensaje', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  // 2. Control de acceso
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si es pública, omitimos el llamado a super.canActivate(context) por completo
    if (isPublic) {
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }
}