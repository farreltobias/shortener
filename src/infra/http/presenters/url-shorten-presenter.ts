import { Url } from '@/domain/shorten/enterprise/entities/url'

export class UrlShortenPresenter {
  static toHTTP(domain: string, url: Url) {
    return {
      shortUrl: `${domain}/${url.code.toString()}`,
    }
  }
}
