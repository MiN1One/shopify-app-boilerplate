import { ShopService } from '@/modules/shop/shop.service';
import { Injectable } from '@nestjs/common';
import { Session } from '@shopify/shopify-api';

@Injectable()
export class AuthService {
  constructor(private readonly shopService: ShopService) {}

  async authenticate(session: Session) {
    const existingShop = await this.shopService.getShop(session.shop);

    if (existingShop) return existingShop;

    return await this.shopService.createShop({ shop: session.shop });
  }
}
