import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopController } from './shop.controller';
import { Shop, ShopSchema } from './shop.schema';
import { ShopService } from './shop.service';

@Module({
  providers: [ShopService],
  controllers: [ShopController],
  exports: [ShopService],
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
  ],
})
export class ShopModule {}
