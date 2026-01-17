import { Module } from '@nestjs/common';
import { SessionModule } from '../session/session.module';
import { ShopModule } from '../shop/shop.module';
import { ShopifyModule } from '../shopify/shopify.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ShopifyModule, ShopModule, SessionModule],
})
export class AuthModule {}
