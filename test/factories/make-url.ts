import { faker } from '@faker-js/faker'

import { NanoID } from '@/core/entities/nano-id'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Url, UrlProps } from '@/domain/shorten/enterprise/entities/url'

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
