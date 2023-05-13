// src/passwordResetRepository.ts

import { Injectable } from '@nestjs/common'
import { PrismaClient, PasswordReset } from '@prisma/client'
import { prismaClient } from '../factories'
import { NewPasswordReset } from '../interfaces'
import nodemailer from 'nodemailer';
import { email as emailConfig, EMAIL_HTML } from '../config';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordResetService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = prismaClient.buildPrismaClient()
  }

  async createPasswordReset(data: NewPasswordReset): Promise<PasswordReset> {
    return this.prisma.passwordReset.create({ data })
  }

  async findPasswordResetById(id: string): Promise<PasswordReset | null> {
    return this.prisma.passwordReset.findUnique({ where: { id } })
  }

  async findPasswordResetByToken(token: string): Promise<PasswordReset | null> {
    return this.prisma.passwordReset.findUnique({ where: { token } })
  }

  async updatePasswordReset(id: string, data: Partial<PasswordReset>): Promise<PasswordReset> {
    return this.prisma.passwordReset.update({ where: { id }, data })
  }

  async deletePasswordReset(id: string): Promise<PasswordReset> {
    return this.prisma.passwordReset.delete({ where: { id } })
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {

    const transporter = nodemailer.createTransport({
      host: emailConfig.smtpHost,
      port: parseInt(emailConfig.smtpPort),
      auth: {
        user: emailConfig.smtpUser,
        pass: emailConfig.smtpPassword
      }
    });

    const mailOptions = {
      from: emailConfig.from,
      to: email,
      subject: emailConfig.subject,
      html: EMAIL_HTML(token)
    };

    await transporter.sendMail(mailOptions);

  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }


}
