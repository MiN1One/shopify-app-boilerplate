import { Controller, Post, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ShopifyService } from './shopify.service';

@Controller('shopify')
export class ShopifyController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @Post('webhooks')
  processWebhooks(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.shopifyService.processWebhooks(req, res);
  }
}
