import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Owner, OwnerProps } from '@/domain/shorten/enterprise/entities/owner'
import { PrismaOwnerMapper } from '@/infra/database/prisma/mappers/prisma-owner-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeOwner(
  override: Partial<OwnerProps> = {},
  id?: UniqueEntityID,
) {
  const owner = Owner.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return owner
}

@Injectable()
export class OwnerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOwner(data: Partial<OwnerProps> = {}): Promise<Owner> {
    const owner = makeOwner(data)

    await this.prisma.user.create({
      data: PrismaOwnerMapper.toPrisma(owner),
    })

    return owner
  }
}
