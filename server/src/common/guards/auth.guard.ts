import { ShopifyService } from '@/modules/shopify/shopify.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RequestedTokenType } from '@shopify/shopify-api';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly shopifyService: ShopifyService) {}

  static getSessionToken(request: FastifyRequest) {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer')) {
      return authHeader.split('Bearer ')[1];
    }
    return (request.query as Record<string, string>).id_token;
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

      const { session } = await this.shopifyService.shopify.auth.tokenExchange({
        sessionToken,
        shop,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      });

      request.session = session;

      return true;
    } catch (er) {
      Logger.error(er, 'AuthGuard:canActivate');
      return false;
    }
  }
}
