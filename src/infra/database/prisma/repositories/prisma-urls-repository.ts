import { Injectable } from '@nestjs/common'

import {
  FindManyRecentParams,
  UrlsRepository,
} from '@/domain/shorten/application/repositories/urls-repository'
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

    await Promise.all([
      this.prisma.url.create({
        data,
      }),

      this.cache.set(`url:${data.code}`, JSON.stringify(data)),
    ])
  }

  async findByCode(code: string): Promise<Url | null> {
    const cacheHit = await this.cache.get(`url:${code}`)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return PrismaUrlMapper.toDomain(cacheData)
    }

    const url = await this.prisma.url.findFirst({
      where: { code, deletedAt: null },
    })

    if (!url) return null

    await this.cache.set(`url:${code}`, JSON.stringify(url))

    return PrismaUrlMapper.toDomain(url)
  }

  async save(url: Url, urlCode = url.code.toString()): Promise<void> {
    const data = PrismaUrlMapper.toPrisma(url)

    await Promise.all([
      this.prisma.url.update({
        where: { id: data.id, deletedAt: null },
        data,
      }),

      this.cache.delete(`url:${urlCode}`),
      this.cache.set(`url:${data.code}`, JSON.stringify(data)),
    ])
  }

  async delete(url: Url): Promise<void> {
    await Promise.all([
      this.prisma.url.update({
        where: { id: url.id.toString() },
        data: { deletedAt: new Date() },
      }),

      this.cache.delete(`url:${url.code.toString()}`),
    ])
  }

  async findManyRecent({
    page,
    ownerId,
  }: FindManyRecentParams): Promise<Url[]> {
    const urls = await this.prisma.url.findMany({
      where: { deletedAt: null, ownerId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    })

    return urls.map(PrismaUrlMapper.toDomain)
  }
}
