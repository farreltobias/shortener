import { makeOwner } from 'test/factories/make-owner'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { InMemoryUrlsRepository } from 'test/repositories/in-memory-urls-repository'

import { NanoID } from '../../enterprise/entities/value-objects/nano-id'
import { ShortenUrlUseCase } from './shorten-url'

let inMemoryUrlsRepository: InMemoryUrlsRepository
let inMemoryOwnersRepository: InMemoryOwnersRepository
let sut: ShortenUrlUseCase

describe('Shorten Url', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository()
    inMemoryOwnersRepository = new InMemoryOwnersRepository()
    sut = new ShortenUrlUseCase(inMemoryUrlsRepository)
  })

  it('should be able to create a short url', async () => {
    const result = await sut.execute({
      baseUrl: 'https://farrel.tech/',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      url: inMemoryUrlsRepository.items[0],
    })
  })

  it('should be able to create a short url with an owner', async () => {
    const owner = makeOwner()

    await inMemoryOwnersRepository.create(owner)

    const result = await sut.execute({
      baseUrl: 'https://farrel.tech/',
      ownerId: owner.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      url: expect.objectContaining({
        ownerId: owner.id,
      }),
    })
  })

  it('should be able to create a short url with custom code', async () => {
    const owner = makeOwner()
    await inMemoryOwnersRepository.create(owner)

    const customCode = '123abc'

    const result = await sut.execute({
      baseUrl: 'https://farrel.tech/',
      ownerId: owner.id.toString(),
      customCode,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      url: expect.objectContaining({
        code: new NanoID(customCode),
      }),
    })
  })

  it('should not be able to create a short url with custom code without owner', async () => {
    const customCode = '123abc'

    const result = await sut.execute({
      baseUrl: 'https://farrel.tech/',
      customCode,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      url: expect.not.objectContaining({
        code: new NanoID(customCode),
      }),
    })
  })
})
