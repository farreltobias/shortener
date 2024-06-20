import { Injectable } from '@nestjs/common'

import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'
import { Url } from '@/domain/shorten/enterprise/entities/url'
import { NanoID } from '@/domain/shorten/enterprise/entities/value-objects/nano-id'

import { PrismaUrlMapper } from '../mappers/prisma-url-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUrlsRepository implements UrlsRepository {
  constructor(private prisma: PrismaService) {}

  async create(url: Url): Promise<void> {
    const data = PrismaUrlMapper.toPrisma(url)

    await this.prisma.url.create({
      data,
    })
  }

  async findByCode(code: NanoID): Promise<Url | null> {
    const url = await this.prisma.url.findUnique({
      where: {
        code: code.toString(),
      },
    })

    if (!url) {
      return null
    }

    return PrismaUrlMapper.toDomain(url)
  }
}
