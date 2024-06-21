import { makeUrl } from 'test/factories/make-url'
import { InMemoryUrlsRepository } from 'test/repositories/in-memory-urls-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { NanoID } from '../../enterprise/entities/value-objects/nano-id'
import { EditUrlUseCase } from './edit-url'

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: EditUrlUseCase

describe('Edit Url', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository()
    sut = new EditUrlUseCase(inMemoryUrlsRepository)
  })

  it('should be able to edit a url', async () => {
    const newUrl = makeUrl({
      ownerId: new UniqueEntityID('owner-1'),
      code: new NanoID('123abc'),
    })

    await inMemoryUrlsRepository.create(newUrl)

    await sut.execute({
      urlCode: newUrl.code.toValue(),
      ownerId: 'owner-1',
      baseUrl: 'https://farrel.tech/',
      newCode: '456def',
    })

    expect(inMemoryUrlsRepository.items[0]).toMatchObject({
      baseUrl: 'https://farrel.tech/',
      code: new NanoID('456def'),
    })
  })

  it('should not be able to edit a url from another user', async () => {
    const newUrl = makeUrl({
      ownerId: new UniqueEntityID('owner-1'),
      code: new NanoID('123abc'),
    })

    await inMemoryUrlsRepository.create(newUrl)

    const result = await sut.execute({
      urlCode: newUrl.code.toValue(),
      ownerId: 'owner-2',
      baseUrl: 'https://farrel.tech/',
      newCode: '456def',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
