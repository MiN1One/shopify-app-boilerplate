import { Session } from '@shopify/shopify-api';

declare module 'fastify' {
  interface FastifyRequest {
    session: Session;
  }
}
