// src/userRepository.ts

import { Injectable } from '@nestjs/common'
import { PrismaClient, User } from '@prisma/client'
import { prismaClient } from '../factories'
import { NewUser } from '../interfaces'
import { jwt as jwtConfig } from '../config';
import jwt from 'jsonwebtoken';


@Injectable()
export class UserService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = prismaClient.buildPrismaClient()
  }

  async createUser(data: NewUser): Promise<User> {
    return this.prisma.user.create({ data })
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email: { equals: email }, isActive: { equals: true } } })
  }

  async findUserAndTwoFactorByEmail(email: string): Promise<User & { twoFactorAuth: { enabled: boolean } } | null> {
    return this.prisma.user.findFirst({
      where: { email: { equals: email }, isActive: { equals: true } },
      include: { twoFactorAuth: { select: { enabled: true } } }
    })
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data })
  }

  async deleteUser(id: string): Promise<User> {
    const data: Partial<User> = { isActive: false }
    return this.prisma.user.update({ where: { id }, data })
  }

  async generateJwtToken(id: string, email: string) {
    const payload = {
      id,
      email
    };
    const secret = jwtConfig.secret
    const options = {
      expiresIn: '1h', // You can adjust the expiration time as needed
    };

    return jwt.sign(payload, secret, options);
  }

  async verifyJwtToken(jwtToken: string) {
    const secret = jwtConfig.secret;

    try {
      const decoded = jwt.verify(jwtToken, secret);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error };
    }
  }

}
