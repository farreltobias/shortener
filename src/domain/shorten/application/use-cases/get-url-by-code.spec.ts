import { makeUrl } from 'test/factories/make-url'
import { InMemoryUrlsRepository } from 'test/repositories/in-memory-urls-repository'

import { NanoID } from '@/core/entities/nano-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { GetUrlByCodeUseCase } from './get-url-by-code'

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: GetUrlByCodeUseCase

describe('Get Url by code', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository()
    sut = new GetUrlByCodeUseCase(inMemoryUrlsRepository)
  })

  it('should be able to get url by code', async () => {
    const code = new NanoID()
    const url = makeUrl({ code })

    await inMemoryUrlsRepository.create(url)

    const result = await sut.execute({
      code: code.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ url })
  })

  it('should not be able to get url by code that does not exist', async () => {
    const code = new NanoID()

    const result = await sut.execute({
      code: code.toString(),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
