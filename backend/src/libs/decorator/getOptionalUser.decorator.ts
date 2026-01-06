import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const GetOptionalUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const logger = new Logger('GetOptionalUser');

    if (request.user) {
      return request.user;
    }

    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const parts = token.split('.');

        if (parts.length !== 3) {
            return null;
        }

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

        const payloadBuffer = Buffer.from(paddedBase64, 'base64');
        const userPayload = JSON.parse(payloadBuffer.toString());

        if (!userPayload.id && userPayload.sub) {
            userPayload.id = userPayload.sub;
        }

        return userPayload;
      } catch (error) {
        logger.warn(`Failed to parse optional token: ${error.message}`);
        return null;
      }
    }

    return null;
  },
);