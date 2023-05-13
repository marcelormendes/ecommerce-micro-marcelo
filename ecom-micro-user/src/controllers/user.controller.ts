// src/UserController.ts

import { Body, Controller, Delete, Param, Post, Put, Response, Get } from "@nestjs/common";
import { PasswordResetService, TwoFactorAuthService, UserService } from "../services";
import { NewUser, UpdatePassword } from "../interfaces";
import { Response as ExpressResponse } from "express";
import crypto from 'crypto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly passwordResetService: PasswordResetService) { }

  @Post()
  async createUser(
    @Body() newUser: NewUser,
    @Response() res: ExpressResponse) {
    try {

      const { email, password } = newUser;
      const hashedPassword = await this.passwordResetService.hashPassword(password);
      const user = await this.userService.createUser({ email, password: hashedPassword });
      res.json({ user });
    } catch (error) {
      res.status(400).json({ message: 'Error creating PasswordRese', error });
    }
  };

  @Post('/password-reset')
  async generatePasswordReset(
    @Body() createPasswordBody: { email: string },
    @Response() res: ExpressResponse) {

    try {

      const { email } = createPasswordBody;
      const { id } = await this.userService.findUserByEmail(email);
      const token = crypto.randomBytes(32).toString('hex');

      const passwordReset = await this.passwordResetService.createPasswordReset({
        token,
        userId: id,
        expiresAt: new Date(Date.now() + 3600000)
      });

      await this.passwordResetService.sendPasswordResetEmail(email, token);
      res.json({ passwordReset });
    } catch (error) {
      res.status(400).json({ message: 'Error creating PasswordRese', error });
    }

  };

  @Post('/create-two-factor-auth')
  async createTwoFactor(
    @Body() twoFactorBody: { userId: string },
    @Response() res: ExpressResponse) {

    try {
      res.json(await this.twoFactorAuthService.createTwoFactorAuth(twoFactorBody.userId));
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to create two-factor authentication', error });
    }

  };

  @Post('/enable-two-factor-auth')
  async createTwoFactorAuth(
    @Body() twoFactorBody: { userId: string },
    @Response() res: ExpressResponse) {

    try {
      await this.twoFactorAuthService.updateTwoFactorAuthByUserId(twoFactorBody.userId, { enabled: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to enable two-factor authentication', error });
    }

  };

  @Post('/disable-two-factor-auth')
  async disableTwoFactor(
    @Body() twoFactorBody: { userId: string },
    @Response() res: ExpressResponse) {

    try {
      await this.twoFactorAuthService.updateTwoFactorAuthByUserId(twoFactorBody.userId, { enabled: false });
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to disable two-factor authentication', });
    }

  };

  @Post('/verify-token')
  async verifyToken(
    @Body() verifyTokenBody: { userId: string, token: string },
    @Response() res: ExpressResponse) {

    try {

      const { userId, token } = verifyTokenBody;
      const verified = await this.twoFactorAuthService.verifyToken(userId, token);

      if (verified) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, message: 'Invalid token' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error while verifying token', error });
    }

  };

  @Put('/password-reset/update')
  async updatePassword(
    @Body() updatePasswordBody: UpdatePassword,
    @Response() res: ExpressResponse) {

    try {

      const { token, newPassword } = updatePasswordBody;
      const { userId, expiresAt } = await this.passwordResetService.findPasswordResetByToken(token);

      if (expiresAt > new Date()) {
        res.status(400).json({ message: 'Token invalid or expired' });
      }

      const hashedPassword = await this.passwordResetService.hashPassword(newPassword);
      const result = await this.userService.updateUser(userId, { password: hashedPassword });

      if (result) {
        res.json(result);
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error updating Password', error });
    }

  };

  @Get('/:id')
  async findUserById(
    @Param('id') id: string,
    @Response() res: ExpressResponse) {

    try {
      const user = await this.userService.findUserById(id);

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error retrieving User', error });
    }

  };

  @Delete('/:id')
  async deleteUserById(
    @Param('id') id: string,
    @Response() res: ExpressResponse) {

    try {
      const user = await this.userService.deleteUser(id);

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error deleting User', error });
    }

  };
}
