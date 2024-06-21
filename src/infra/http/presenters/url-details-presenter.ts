import { Url } from '@/domain/shorten/enterprise/entities/url'

export class UrlDetailsPresenter {
  static toHTTP(domain: string, url: Url) {
    return {
      baseUrl: url.baseUrl,
      shortUrl: `${domain}/${url.code.toString()}`,
      usedCount: url.usedCount,
    }
  }
}
