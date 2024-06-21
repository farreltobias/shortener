import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OwnerFactory } from 'test/factories/make-owner'
import { UrlFactory } from 'test/factories/make-url'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit Url (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let ownerFactory: OwnerFactory
  let urlFactory: UrlFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OwnerFactory, UrlFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    ownerFactory = moduleRef.get(OwnerFactory)
    urlFactory = moduleRef.get(UrlFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /urls/:id', async () => {
    const user = await ownerFactory.makePrismaOwner()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const url = await urlFactory.makePrismaUrl({
      ownerId: user.id,
    })

    const urlCode = url.code.toString()

    const response = await request(app.getHttpServer())
      .put(`/${urlCode}/edit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        url: 'https://farrel.tech/',
        code: '456def',
      })

    expect(response.statusCode).toBe(204)

    const urlOnDatabase = await prisma.url.findFirst({
      where: {
        baseUrl: 'https://farrel.tech/',
        code: '456def',
      },
    })

    expect(urlOnDatabase).toBeTruthy()
  })
})
