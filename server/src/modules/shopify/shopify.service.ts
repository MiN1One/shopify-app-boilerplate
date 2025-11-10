import { appConfig } from '@/app.config';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import {
  ApiVersion,
  DeliveryMethod,
  Shopify,
  shopifyApi,
} from '@shopify/shopify-api';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class ShopifyService implements OnModuleInit {
  shopify: Shopify;

  constructor(
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
  ) {}

  async processWebhooks(req: FastifyRequest, res: FastifyReply) {
    Logger.log('processing webhook');
    await this.shopify.webhooks.process({
      rawBody: req.rawBody?.toString() || '',
      rawRequest: req.raw,
      rawResponse: res.raw,
    });
  }

  async handleWebhooks() {
    Logger.log('received webhook');
  }

  onModuleInit() {
    this.shopify = shopifyApi({
      apiKey: this.config.shopifyApiKey,
      apiSecretKey: this.config.shopifyApiSecret,
      scopes: this.config.shopifyScopes,
      hostName: this.config.host,
      apiVersion: ApiVersion.July25,
      isEmbeddedApp: true,
    });
    this.shopify.webhooks.addHandlers({
      PRODUCTS_UPDATE: [
        {
          deliveryMethod: DeliveryMethod.Http,
          callbackUrl: '/api/shopify/webhooks',
          callback: this.handleWebhooks,
        },
      ],
    });
  }
}
