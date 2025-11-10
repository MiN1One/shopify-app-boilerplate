import { SessionToken } from '@/common/decorators/session-token.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Session } from '@shopify/shopify-api';
import { AuthService } from './auth.service';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Get()
  authenticate(@SessionToken() session: Session) {
    return this.authService.authenticate(session);
  }
}
