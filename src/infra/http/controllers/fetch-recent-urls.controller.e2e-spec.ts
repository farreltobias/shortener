import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { OwnerFactory } from 'test/factories/make-owner'
import { UrlFactory } from 'test/factories/make-url'

import { NanoID } from '@/domain/shorten/enterprise/entities/value-objects/nano-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { EnvService } from '@/infra/env/env.service'

describe('Fetch Recent Url (E2E)', () => {
  let app: INestApplication
  let ownerFactory: OwnerFactory
  let urlFactory: UrlFactory
  let jwt: JwtService
  let env: EnvService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, EnvModule],
      providers: [OwnerFactory, UrlFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    ownerFactory = moduleRef.get(OwnerFactory)
    urlFactory = moduleRef.get(UrlFactory)
    jwt = moduleRef.get(JwtService)
    env = moduleRef.get(EnvService)

    await app.init()
  })

  test('[GET] /urls/list', async () => {
    const user = await ownerFactory.makePrismaOwner()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      urlFactory.makePrismaUrl({
        ownerId: user.id,
        code: new NanoID('abc123'),
      }),
      urlFactory.makePrismaUrl({
        ownerId: user.id,
        code: new NanoID('def456'),
      }),
    ])

    const DOMAIN = env.get('DOMAIN')

    const response = await request(app.getHttpServer())
      .get('/urls/list')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      urls: expect.arrayContaining([
        expect.objectContaining({ shortUrl: `${DOMAIN}/abc123` }),
        expect.objectContaining({ shortUrl: `${DOMAIN}/def456` }),
      ]),
    })
  })
})
