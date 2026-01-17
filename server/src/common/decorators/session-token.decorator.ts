import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestedTokenType } from '@shopify/shopify-api';
import { FastifyRequest } from 'fastify';

export const SessionToken = createParamDecorator(
  (
    sessionType = RequestedTokenType.OnlineAccessToken,
    context: ExecutionContext,
  ) => context.switchToHttp().getRequest<FastifyRequest>()[sessionType],
);
