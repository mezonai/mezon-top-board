import { MetaKey } from "@libs/constant/meta-key.constant";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(MetaKey.SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const optionalAuth = this.reflector.getAllAndOverride<boolean>(MetaKey.OPTIONAL_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (optionalAuth && (err || !user)) {
      return null;
    }

    return super.handleRequest(err, user, info, context);
  }
}