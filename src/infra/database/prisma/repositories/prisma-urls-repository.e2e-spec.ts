import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { OwnerFactory } from 'test/factories/make-owner'
import { UrlFactory } from 'test/factories/make-url'

import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { DatabaseModule } from '@/infra/database/database.module'

import { PrismaService } from '../prisma.service'

describe('Prisma Url Repository (E2E)', () => {
  let app: INestApplication
  let ownerFactory: OwnerFactory
  let urlFactory: UrlFactory

  let cacheRepository: CacheRepository
  let urlsRepository: UrlsRepository
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OwnerFactory, UrlFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    ownerFactory = moduleRef.get(OwnerFactory)
    urlFactory = moduleRef.get(UrlFactory)

    cacheRepository = moduleRef.get(CacheRepository)
    urlsRepository = moduleRef.get(UrlsRepository)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  it('should cache url details', async () => {
    const user = await ownerFactory.makePrismaOwner()

    const url = await urlFactory.makePrismaUrl({
      ownerId: user.id,
    })

    const code = url.code.toString()

    await urlsRepository.findByCode(code)

    const urlOnDatabase = await prisma.url.findUnique({
      where: { code },
    })

    const cached = await cacheRepository.get(`url:${code}`)

    expect(cached).toEqual(JSON.stringify(urlOnDatabase))
  })

  it('should return cache url details on subsequent calls', async () => {
    const user = await ownerFactory.makePrismaOwner()

    const url = await urlFactory.makePrismaUrl({
      ownerId: user.id,
    })

    const code = url.code.toString()

    const urlOnDatabase = await prisma.url.findUnique({
      where: { code },
    })

    await cacheRepository.set(
      `url:${code}`,
      JSON.stringify({
        ...urlOnDatabase,
        baseUrl: 'https://cached.com',
      }),
    )

    const urlDetails = await urlsRepository.findByCode(code)

    expect(urlDetails).toEqual(
      expect.objectContaining({ baseUrl: 'https://cached.com' }),
    )
  })

  it('should reset url details cache when saving the url', async () => {
    const user = await ownerFactory.makePrismaOwner()

    const url = await urlFactory.makePrismaUrl({
      ownerId: user.id,
    })

    const code = url.code.toString()

    await cacheRepository.set(`url:${code}`, JSON.stringify({ empty: true }))

    await urlsRepository.save(url)

    const cached = await cacheRepository.get(`url:${code}`)

    expect(cached).toBeNull()
  })
})
