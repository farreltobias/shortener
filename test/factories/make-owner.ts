import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Owner, OwnerProps } from '@/domain/shorten/enterprise/entities/owner'

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
