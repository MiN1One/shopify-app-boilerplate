import { Module } from '@nestjs/common';
import { ShopifyController } from './shopify.controller';
import { ShopifyService } from './shopify.service';

@Module({
  providers: [ShopifyService],
  controllers: [ShopifyController],
  exports: [ShopifyService],
})
export class ShopifyModule {}
