import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ShopModule } from './modules/shop/shop.module';
import { ShopifyModule } from './modules/shopify/shopify.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig], isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigType<typeof appConfig>) => ({
        uri: config.dbUrl,
      }),
      inject: [appConfig.KEY],
    }),
    AuthModule,
    ShopifyModule,
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
