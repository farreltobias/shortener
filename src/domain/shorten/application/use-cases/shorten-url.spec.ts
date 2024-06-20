import { InMemoryUrlsRepository } from 'test/repositories/in-memory-urls-repository'

import { ShortenUrl } from './shorten-url'

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: ShortenUrl

describe('Shorten Url', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository()
    sut = new ShortenUrl(inMemoryUrlsRepository)
  })

  it('should be able to create a short url from base url', async () => {
    const result = await sut.execute({
      url: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      url: inMemoryUrlsRepository.items[0],
    })
  })
})
