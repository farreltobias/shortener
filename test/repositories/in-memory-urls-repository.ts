import { PaginationParams } from '@/core/repositories/pagination-params'
import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'
import { Url } from '@/domain/shorten/enterprise/entities/url'

export class InMemoryUrlsRepository implements UrlsRepository {
  public items: Url[] = []

  async create(url: Url) {
    this.items.push(url)
  }

  async findByCode(code: string): Promise<Url | null> {
    const url = this.items.find((url) => url.code.toString() === code)

    if (!url) {
      return null
    }

    return url
  }

  async save(url: Url): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(url.id))

    this.items[index] = url
  }

  async delete(url: Url): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(url.id))

    this.items.splice(itemIndex, 1)
  }

  async findManyRecent({ page }: PaginationParams) {
    const items = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return items
  }
}
