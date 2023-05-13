import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import {
  UserController,
  UserDetailsController,
  LoginController
} from './controllers';

import {
  PasswordResetService,
  TwoFactorAuthService,
  UserDetailsService,
  UserService
} from './services';
import { JwtMiddleWare } from './routes/middleware/jwtMiddleware';

@Module({
  imports: [],
  controllers: [
    LoginController,
    UserController,
    UserDetailsController
  ],
  providers: [
    PasswordResetService,
    TwoFactorAuthService,
    UserDetailsService,
    UserService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleWare)
      .forRoutes('user');
  }
}
