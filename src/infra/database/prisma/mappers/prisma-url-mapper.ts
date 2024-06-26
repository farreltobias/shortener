import { Prisma, Url as PrismaUrl } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Url } from '@/domain/shorten/enterprise/entities/url'
import { NanoID } from '@/domain/shorten/enterprise/entities/value-objects/nano-id'

export class PrismaUrlMapper {
  static toDomain(raw: PrismaUrl): Url {
    return Url.create(
      {
        baseUrl: raw.baseUrl,
        code: new NanoID(raw.code),
        ownerId: raw.ownerId ? new UniqueEntityID(raw.ownerId) : null,
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
      ownerId: url.ownerId?.toString(),
      baseUrl: url.baseUrl,
      usedCount: url.usedCount,
      createdAt: url.createdAt,
      deletedAt: url.deletedAt,
      updatedAt: url.updatedAt,
    }
  }
}
