import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OwnerFactory } from 'test/factories/make-owner'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Shorten Url (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let ownerFactory: OwnerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OwnerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    ownerFactory = moduleRef.get(OwnerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /shorten', async () => {
    const user = await ownerFactory.makePrismaOwner()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const url =
      'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/'

    const response = await request(app.getHttpServer())
      .post(`/shorten`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        url,
        code: '123abc',
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
