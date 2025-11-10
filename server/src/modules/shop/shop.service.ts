import { ShopType } from '@/types/shop.types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from './shop.schema';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: Model<ShopDocument>,
  ) {}

  async createShop(shop: Partial<ShopType>) {
    shop.firstInstallDate = new Date().toISOString();
    return this.shopModel.create(shop);
  }

  async getShop(shop: string) {
    return this.shopModel.findOne({ shop });
  }
}
