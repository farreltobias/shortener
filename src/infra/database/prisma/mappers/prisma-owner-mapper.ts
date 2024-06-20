import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Owner } from '@/domain/shorten/enterprise/entities/owner'

export class PrismaOwnerMapper {
  static toDomain(raw: PrismaUser): Owner {
    return Owner.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(owner: Owner): Prisma.UserUncheckedCreateInput {
    return {
      id: owner.id.toString(),
      email: owner.email,
      name: owner.name,
      password: owner.password,
    }
  }
}
