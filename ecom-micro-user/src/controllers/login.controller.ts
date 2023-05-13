// src/UserController.ts

import { Body, Controller, Next, Post, Response } from "@nestjs/common";
import { PasswordResetService, TwoFactorAuthService, UserService } from "../services";
import { UserLogin } from "../interfaces";
import { Response as ExpressResponse } from "express";

@Controller('login')
export class LoginController {
  constructor(private readonly userService: UserService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly passwordResetService: PasswordResetService) { }

  @Post()
  async authenticate(
    @Body() login: UserLogin,
    @Response() res: ExpressResponse,
    @Next() next: Function) {

    try {

      const user = await this.userService.findUserAndTwoFactorByEmail(login.email);
      const hashedPassword = await this.passwordResetService.hashPassword(login.password);

      if (!user || user && user.password !== hashedPassword) {
        res.status(400).json({ message: 'Credentials are invalid' });
      }

      if (user.twoFactorAuth.enabled) {

        if (!login.token) {
          return res.status(401).send('Two-factor authentication token is required');
        }

        const verified = this.twoFactorAuthService.verifyToken(user.id, login.token);

        if (!verified) {
          return res.status(401).send('Invalid two-factor authentication token');
        }
      }

      const jwtToken = this.userService.generateJwtToken(user.id, user.email);

      res.json({ success: true, jwtToken })

    } catch (error) {
      res.status(400).json({ message: 'authentication failed' });
    }

  };
}
