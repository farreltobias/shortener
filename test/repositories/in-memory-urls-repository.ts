import { NanoID } from '@/core/entities/nano-id'
import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'
import { Url } from '@/domain/shorten/enterprise/entities/url'

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
}
