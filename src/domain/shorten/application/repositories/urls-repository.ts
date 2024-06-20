import { Url } from '../../enterprise/entities/url'
import { NanoID } from '../../enterprise/entities/value-objects/nano-id'

export abstract class UrlsRepository {
  abstract create(url: Url): Promise<void>
  abstract findByCode(code: NanoID): Promise<Url | null>
}
