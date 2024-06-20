import { Prisma, Url as PrismaUrl } from '@prisma/client'

import { NanoID } from '@/core/entities/nano-id'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Url } from '@/domain/shorten/enterprise/entities/url'

export class PrismaUrlMapper {
  static toDomain(raw: PrismaUrl): Url {
    return Url.create(
      {
        baseUrl: raw.baseUrl,
        code: new NanoID(raw.code),
        usedCount: raw.usedCount,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(url: Url): Prisma.UrlUncheckedCreateInput {
    return {
      id: url.id.toString(),
      code: url.code.toString(),
      baseUrl: url.baseUrl,
      usedCount: url.usedCount,
      createdAt: url.createdAt,
      deletedAt: url.deletedAt,
      updatedAt: url.updatedAt,
    }
  }
}
