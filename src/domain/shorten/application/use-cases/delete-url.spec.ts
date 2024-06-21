import { makeUrl } from 'test/factories/make-url'
import { InMemoryUrlsRepository } from 'test/repositories/in-memory-urls-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { NanoID } from '../../enterprise/entities/value-objects/nano-id'
import { DeleteUrlUseCase } from './delete-url'

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: DeleteUrlUseCase

describe('Delete Url', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository()
    sut = new DeleteUrlUseCase(inMemoryUrlsRepository)
  })

  it('should be able to delete a url', async () => {
    const newUrl = makeUrl({
      ownerId: new UniqueEntityID('owner-1'),
      code: new NanoID('123abc'),
    })

    await inMemoryUrlsRepository.create(newUrl)

    await sut.execute({
      urlCode: '123abc',
      ownerId: 'owner-1',
    })

    expect(inMemoryUrlsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a url from another owner', async () => {
    const newUrl = makeUrl({
      ownerId: new UniqueEntityID('owner-1'),
      code: new NanoID('123abc'),
    })

    await inMemoryUrlsRepository.create(newUrl)

    const result = await sut.execute({
      urlCode: '123abc',
      ownerId: 'owner-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete a url without owner', async () => {
    const newUrl = makeUrl({
      code: new NanoID('123abc'),
    })

    await inMemoryUrlsRepository.create(newUrl)

    const result = await sut.execute({
      urlCode: '123abc',
      ownerId: 'owner-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
