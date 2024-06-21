import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'
import { Url } from '@/domain/shorten/enterprise/entities/url'

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

  async findByCode(code: string): Promise<Url | null> {
    const url = await this.prisma.url.findUnique({
      where: {
        code,
      },
    })

    if (!url) {
      return null
    }

    return PrismaUrlMapper.toDomain(url)
  }

  async save(url: Url): Promise<void> {
    const data = PrismaUrlMapper.toPrisma(url)

    await this.prisma.url.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(url: Url): Promise<void> {
    await this.prisma.url.delete({
      where: { id: url.id.toString() },
    })
  }

  async findManyRecent({ page }: PaginationParams): Promise<Url[]> {
    const urls = await this.prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    })

    return urls.map(PrismaUrlMapper.toDomain)
  }
}
