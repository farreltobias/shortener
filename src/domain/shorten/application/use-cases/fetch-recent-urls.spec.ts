import { makeUrl } from 'test/factories/make-url'
import { InMemoryUrlsRepository } from 'test/repositories/in-memory-urls-repository'

import { FetchRecentUrlsUseCase } from './fetch-recent-urls'

let inMemoryUrlsRepository: InMemoryUrlsRepository
let sut: FetchRecentUrlsUseCase

describe('Fetch Recent Urls', () => {
  beforeEach(() => {
    inMemoryUrlsRepository = new InMemoryUrlsRepository()
    sut = new FetchRecentUrlsUseCase(inMemoryUrlsRepository)
  })

  it('should be able to fetch recent urls', async () => {
    await inMemoryUrlsRepository.create(
      makeUrl({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryUrlsRepository.create(
      makeUrl({ createdAt: new Date(2024, 0, 18) }),
    )
    await inMemoryUrlsRepository.create(
      makeUrl({ createdAt: new Date(2024, 0, 23) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.urls).toHaveLength(3)
    expect(result.value?.urls).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent urls', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryUrlsRepository.create(makeUrl())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.urls).toHaveLength(2)
  })
})
