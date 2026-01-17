import { RequestedTokenType, Session } from '@shopify/shopify-api';

declare module 'fastify' {
  interface FastifyRequest {
    [RequestedTokenType.OfflineAccessToken]: Session;
    [RequestedTokenType.OnlineAccessToken]: Session;
  }
}
