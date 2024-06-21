import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'
import { Url } from '@/domain/shorten/enterprise/entities/url'
import { CacheRepository } from '@/infra/cache/cache-repository'

import { PrismaUrlMapper } from '../mappers/prisma-url-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUrlsRepository implements UrlsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async create(url: Url): Promise<void> {
    const data = PrismaUrlMapper.toPrisma(url)

    await this.prisma.url.create({
      data,
    })
  }

  async findByCode(code: string): Promise<Url | null> {
    const cacheHit = await this.cache.get(`url:${code}`)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return PrismaUrlMapper.toDomain(cacheData)
    }

    const url = await this.prisma.url.findUnique({
      where: {
        code,
      },
    })

    if (!url) return null

    await this.cache.set(`url:${code}`, JSON.stringify(url))

    return PrismaUrlMapper.toDomain(url)
  }

  async save(url: Url): Promise<void> {
    const data = PrismaUrlMapper.toPrisma(url)

    await Promise.all([
      this.prisma.url.update({
        where: { id: data.id },
        data,
      }),

      this.cache.delete(`url:${data.code}`),
    ])
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
