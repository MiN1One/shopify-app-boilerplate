import fastifyHttpProxy from '@fastify/http-proxy';
import fastifyStatic from '@fastify/static';
import { Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import '@shopify/shopify-api/adapters/node';
import { configDotenv } from 'dotenv';
import fastify, {
  DoneFuncWithErrOrRes,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyRawBody from 'fastify-raw-body';
import { join } from 'path';
import { appConfig } from './app.config';
import { AppModule } from './app.module';

configDotenv();

const configureClientProxy = (server: ReturnType<typeof fastify>) => {
  if (process.env.NODE_ENV === 'development') {
    server.register(fastifyHttpProxy, {
      upstream: process.env.DEV_CLIENT_PROXY,
      prefix: '/',
      rewritePrefix: '',
      websocket: true,
      preHandler: (
        req: FastifyRequest,
        reply: FastifyReply,
        done: DoneFuncWithErrOrRes,
      ) => {
        if (req.url.startsWith('/api')) {
          return reply.callNotFound();
        }
        done();
      },
    });
  } else {
    server.register(fastifyStatic, {
      root: join(__dirname, '..', 'public'),
    });
  }
};

async function bootstrap() {
  const server = fastify();
  configureClientProxy(server);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(server),
  );
  await server.register(fastifyRawBody, {
    field: 'rawBody',
    global: true,
    encoding: 'utf8',
    runFirst: true,
  });
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  app.setGlobalPrefix('api');
  await app.listen(config.port, () =>
    Logger.log(`Server running on port ${config.port} ✔`),
  );
}

bootstrap();
