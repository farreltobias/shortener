import { makeUrl } from 'test/factories/make-url'
import { InMemoryUrlsRepository } from 'test/repositories/in-memory-urls-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { NanoID } from '../../enterprise/entities/value-objects/nano-id'
import { UseUrlUseCase } from './use-url'

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: UseUrlUseCase

describe('Use Url', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository()
    sut = new UseUrlUseCase(inMemoryUrlsRepository)
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

  it('should be able to count url as used', async () => {
    const code = new NanoID()
    const url = makeUrl({ code, usedCount: 0 })

    await inMemoryUrlsRepository.create(url)

    const result = await sut.execute({
      code: code.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      url: expect.objectContaining({
        usedCount: 1,
      }),
    })
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
