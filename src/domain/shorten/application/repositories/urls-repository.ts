import { PaginationParams } from '@/core/repositories/pagination-params'

import { Url } from '../../enterprise/entities/url'

export abstract class UrlsRepository {
  abstract create(url: Url): Promise<void>
  abstract findByCode(code: string): Promise<Url | null>
  abstract save(url: Url): Promise<void>
  abstract delete(url: Url): Promise<void>
  abstract findManyRecent(params: PaginationParams): Promise<Url[]>
}
