import { EShopifyEvent } from '@/types/event.types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeliveryMethod } from '@shopify/shopify-api';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ShopifyService } from '../shopify/shopify.service';

const WEBHOOKS_PATH = '/api/webhook';

@Injectable()
export class WebhookService implements OnModuleInit {
  constructor(
    private readonly shopifyService: ShopifyService,
    private eventEmitter: EventEmitter2,
  ) {}

  async processWebhooks(req: FastifyRequest, res: FastifyReply) {
    await this.shopifyService.shopify.webhooks.process({
      rawBody: req.rawBody?.toString() || '',
      rawRequest: req.raw,
      rawResponse: res.raw,
    });
  }

  async handleProductUpdatedWebhook(...args) {
    console.log(...args);
    // Logger.log('received webhook ' + topic + ' for shop ' + shop);
  }

  async handleBulkOperationFinishWebhook(
    topic: string,
    shop: string,
    webhookRequestBody: string,
    webhookId: string,
    apiVersion: string,
  ) {
    console.log(topic);
    this.eventEmitter.emit(EShopifyEvent.BULK_OPERATION_FINISH, {});
  }

  onModuleInit() {
    this.shopifyService.shopify.webhooks.addHandlers({
      PRODUCTS_UPDATE: [
        {
          deliveryMethod: DeliveryMethod.Http,
          callbackUrl: WEBHOOKS_PATH,
          callback: this.handleProductUpdatedWebhook,
        },
      ],
      BULK_OPERATIONS_FINISH: [
        {
          deliveryMethod: DeliveryMethod.Http,
          callbackUrl: WEBHOOKS_PATH,
          callback: this.handleBulkOperationFinishWebhook,
        },
      ],
    });
  }
}
