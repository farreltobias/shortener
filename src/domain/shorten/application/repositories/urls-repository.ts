import { NanoID } from '@/core/entities/nano-id'

import { Url } from '../../enterprise/entities/url'

export abstract class UrlsRepository {
  abstract create(url: Url): Promise<void>
  abstract findByCode(code: NanoID): Promise<Url | null>
}
