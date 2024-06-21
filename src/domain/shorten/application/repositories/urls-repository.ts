import { PaginationParams } from '@/core/repositories/pagination-params'

import { Url } from '../../enterprise/entities/url'

export type FindManyRecentParams = {
  ownerId: string
} & PaginationParams

export abstract class UrlsRepository {
  abstract create(url: Url): Promise<void>
  abstract findByCode(code: string): Promise<Url | null>
  abstract save(url: Url, urlCode?: string): Promise<void>
  abstract delete(url: Url): Promise<void>
  abstract findManyRecent(params: FindManyRecentParams): Promise<Url[]>
}
