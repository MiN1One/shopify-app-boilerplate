import { SessionService } from '@/modules/session/session.service';
import { ShopifyService } from '@/modules/shopify/shopify.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RequestedTokenType, Session } from '@shopify/shopify-api';
import { FastifyRequest } from 'fastify';
import mongoose from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly sessionService: SessionService,
  ) {}

  static getSessionToken(request: FastifyRequest) {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer')) {
      return authHeader.split('Bearer ')[1];
    }
    return (request.query as Record<string, string>).id_token;
  }

  async createSession(session: Session) {
    try {
      await this.sessionService.createSession({
        accessToken: session.accessToken,
        id: session.id,
        shop: session.shop,
        expires: session.expires?.toISOString(),
        isOnline: session.isOnline,
        scope: session.scope,
      });
    } catch (er) {
      if (er instanceof mongoose.mongo.MongoServerError && er.code === 11000) {
        Logger.log('Session already exists', 'AuthGuard:createSession');
      } else {
        Logger.error(er, 'AuthGuard:createSession');
      }
    }
  }

  async storeSession(
    sessionToken: string,
    shop: string,
    request: FastifyRequest,
  ) {
    const sessionTypes = Object.values(
      RequestedTokenType,
    ) as RequestedTokenType[];
    await Promise.all(
      sessionTypes.map(async (type) => {
        const { session } =
          await this.shopifyService.shopify.auth.tokenExchange({
            sessionToken,
            shop,
            requestedTokenType: type,
          });

        request[type] = session;
        await this.createSession(session);
      }),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<FastifyRequest>();
      const query = request.query as Record<string, string>;
      const shop = this.shopifyService.shopify.utils.sanitizeShop(
        query.shop,
        true,
      );

      if (!shop) return false;

      const sessionToken = AuthGuard.getSessionToken(request);

      if (!sessionToken || !shop) return false;

      await this.storeSession(sessionToken, shop, request);

      return true;
    } catch (er) {
      Logger.error(er, 'AuthGuard:canActivate');
      return false;
    }
  }
}
