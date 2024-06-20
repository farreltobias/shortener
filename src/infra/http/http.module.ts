import { Module } from '@nestjs/common'

import { GetUrlByCodeUseCase } from '@/domain/shorten/application/use-cases/get-url-by-code'
import { RegisterOwnerUseCase } from '@/domain/shorten/application/use-cases/register-owner'
import { ShortenUrlUseCase } from '@/domain/shorten/application/use-cases/shorten-url'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { RedirectController } from './controllers/redirect.controller'
import { ShortenUrlController } from './controllers/shorten-url.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    ShortenUrlController,
    RedirectController,
    CreateAccountController,
  ],
  providers: [ShortenUrlUseCase, GetUrlByCodeUseCase, RegisterOwnerUseCase],
})
export class HttpModule {}
