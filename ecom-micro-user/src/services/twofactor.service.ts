// src/twoFactorAuthRepository.ts

import { Injectable } from '@nestjs/common'
import { PrismaClient, TwoFactorAuth } from '@prisma/client'
import { prismaClient } from '../factories'
import { CreateTwoFactorResponse, NewTwoFactorAuth } from '../interfaces'
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = prismaClient.buildPrismaClient()
  }

  async createTwoFactorAuth(userId: string): Promise<CreateTwoFactorResponse> {
    const { secret, qrCode } = await this.generateSecretAndQRCode(userId);
    const result = await this.prisma.twoFactorAuth.create({ data: { userId, secret } })

    const codes: string[] = [];

    for (let i = 0; i < 5; i++) {
      const code = speakeasy.generateSecret({ length: 10 });
      codes.push(code.base32);
    }

    const backupCodes = codes.map(code => ({ twoFactorAuthId: result.id, code }));
    await this.prisma.backupCode.createMany({ data: backupCodes });

    return { success: true, qrCode, backupCodes: codes }
  }

  async findTwoFactorAuthById(id: string): Promise<TwoFactorAuth | null> {
    return this.prisma.twoFactorAuth.findUnique({ where: { id } })
  }

  async findTwoFactorAuthByUserId(userId: string): Promise<TwoFactorAuth | null> {
    return this.prisma.twoFactorAuth.findUnique({ where: { userId } })
  }

  async updateTwoFactorAuthByUserId(userId: string, data: Partial<TwoFactorAuth>): Promise<TwoFactorAuth> {
    return this.prisma.twoFactorAuth.update({ where: { userId }, data })
  }

  private async generateSecretAndQRCode(userId: string) {
    const secret = speakeasy.generateSecret({ length: 20 });
    const otpURL = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `MarceloService:${userId}`,
      algorithm: 'sha1',
      digits: 6,
      period: 30,
    });

    const qrCode = await QRCode.toDataURL(otpURL);

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  async verifyToken(userId: string, token: string) {

    const { secret } = await this.prisma.twoFactorAuth.findUnique({ where: { userId }, select: { secret: true } });

    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token,
    });

  }


}
