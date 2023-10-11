import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      throw new ForbiddenException();
    }

    try {
      const data = this.authService.checkToken(authorization.split(' ')[1]);

      request.tokenPayload = data;

      return true;
    } catch {
      return false;
    }
  }
}
