import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Shorten Url (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /shorten', async () => {
    const url =
      'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/'

    const response = await request(app.getHttpServer()).post(`/shorten`).send({
      url,
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      shortUrl: expect.any(String),
    })

    const deliveryOnDatabase = await prisma.url.findFirst({
      where: { baseUrl: url },
    })

    expect(deliveryOnDatabase).toBeTruthy()
  })
})
