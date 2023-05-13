// src/userDetailsRepository.ts

import { Injectable } from '@nestjs/common'
import { PrismaClient, UserDetails } from '@prisma/client'
import { prismaClient } from '../factories'
import { NewUserDetails } from '../interfaces'

@Injectable()
export class UserDetailsService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = prismaClient.buildPrismaClient()
  }

  async createUserDetails(data: NewUserDetails): Promise<UserDetails> {
    return this.prisma.userDetails.create({ data })
  }

  async findUserDetailsById(id: string): Promise<UserDetails | null> {
    return this.prisma.userDetails.findUnique({ where: { id } })
  }

  async updateUserDetails(id: string, data: Partial<UserDetails>): Promise<UserDetails> {
    return this.prisma.userDetails.update({ where: { id }, data })
  }

  async deleteUserDetails(id: string): Promise<UserDetails> {
    return this.prisma.userDetails.delete({ where: { id } })
  }
}
