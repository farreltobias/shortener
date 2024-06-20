import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Url, UrlProps } from '@/domain/shorten/enterprise/entities/url'
import { NanoID } from '@/domain/shorten/enterprise/entities/value-objects/nano-id'
import { PrismaUrlMapper } from '@/infra/database/prisma/mappers/prisma-url-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeUrl(override: Partial<UrlProps> = {}, id?: UniqueEntityID) {
  const url = Url.create(
    {
      baseUrl: faker.internet.url(),
      code: new NanoID(),
      ...override,
    },
    id,
  )

  return url
}

@Injectable()
export class UrlFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUrl(data: Partial<UrlProps> = {}): Promise<Url> {
    const url = makeUrl(data)

    await this.prisma.url.create({
      data: PrismaUrlMapper.toPrisma(url),
    })

    return url
  }
}
