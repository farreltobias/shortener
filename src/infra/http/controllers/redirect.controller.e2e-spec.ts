import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UrlFactory } from 'test/factories/make-url'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Redirect Url (E2E)', () => {
  let app: INestApplication
  let urlFactory: UrlFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UrlFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    urlFactory = moduleRef.get(UrlFactory)

    await app.init()
  })

  test('[POST] /:code', async () => {
    const baseUrl =
      'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/'

    const url = await urlFactory.makePrismaUrl({ baseUrl })

    const response = await request(app.getHttpServer())
      .get(`/${url.code}`)
      .send()

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toEqual(baseUrl)
  })
})
