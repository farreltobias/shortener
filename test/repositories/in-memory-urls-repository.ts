import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'
import { Url } from '@/domain/shorten/enterprise/entities/url'
import { NanoID } from '@/domain/shorten/enterprise/entities/value-objects/nano-id'

export class InMemoryUrlsRepository implements UrlsRepository {
  public items: Url[] = []

  async create(url: Url) {
    this.items.push(url)
  }

  async findByCode(code: NanoID): Promise<Url | null> {
    const url = this.items.find((url) => url.code.equals(code))

    if (!url) {
      return null
    }

    return url
  }

  async findById(id: string): Promise<Url | null> {
    const url = this.items.find((url) => url.id.toString() === id)

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
