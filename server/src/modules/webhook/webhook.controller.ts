import { Controller, Post, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  processWebhooks(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    console.log(JSON.stringify(req.headers, undefined, 2));
    return this.webhookService.processWebhooks(req, res);
  }
}
