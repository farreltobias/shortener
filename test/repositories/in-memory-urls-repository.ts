import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'
import { Url } from '@/domain/shorten/enterprise/entities/url'

export class InMemoryUrlsRepository implements UrlsRepository {
  public items: Url[] = []

  async create(url: Url) {
    this.items.push(url)
  }
}
