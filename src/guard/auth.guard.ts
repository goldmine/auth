import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorator/public.decorator';
import { TokenService } from 'src/tool/token/token.service';

@Injectable() //否则无法使用tokenService
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log(isPublic);
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    console.log(token);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.tokenService.decodeToken(token);
      console.log(`payload is ${payload}`);

      request['user'] = payload;

      if (payload) {
        return true;
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  private extractToken(request: Request) {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
