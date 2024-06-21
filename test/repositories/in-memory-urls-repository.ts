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
}
