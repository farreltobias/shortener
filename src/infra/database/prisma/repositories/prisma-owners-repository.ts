import { Injectable } from '@nestjs/common'

import { OwnersRepository } from '@/domain/shorten/application/repositories/owners-repository'
import { Owner } from '@/domain/shorten/enterprise/entities/owner'

import { PrismaOwnerMapper } from '../mappers/prisma-owner-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOwnersRepository implements OwnersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Owner | null> {
    const owner = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!owner) return null

    return PrismaOwnerMapper.toDomain(owner)
  }

  async create(owner: Owner): Promise<void> {
    const data = PrismaOwnerMapper.toPrisma(owner)

    await this.prisma.user.create({
      data,
    })
  }
}
