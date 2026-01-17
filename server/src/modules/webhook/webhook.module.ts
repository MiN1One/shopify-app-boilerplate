import { Module } from '@nestjs/common';
import { ShopifyModule } from '../shopify/shopify.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [ShopifyModule],
})
export class WebhookModule {}
