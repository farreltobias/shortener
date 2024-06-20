import { Url } from '../../enterprise/entities/url'

export abstract class UrlsRepository {
  abstract create(url: Url): Promise<void>
}
