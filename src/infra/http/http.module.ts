import { Module } from '@nestjs/common'

import { AuthenticateOwnerUseCase } from '@/domain/shorten/application/use-cases/authenticate-owner'
import { GetUrlByCodeUseCase } from '@/domain/shorten/application/use-cases/get-url-by-code'
import { RegisterOwnerUseCase } from '@/domain/shorten/application/use-cases/register-owner'
import { ShortenUrlUseCase } from '@/domain/shorten/application/use-cases/shorten-url'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { RedirectController } from './controllers/redirect.controller'
import { ShortenUrlController } from './controllers/shorten-url.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    ShortenUrlController,
    RedirectController,
    CreateAccountController,
    AuthenticateController,
  ],
  providers: [
    ShortenUrlUseCase,
    GetUrlByCodeUseCase,
    RegisterOwnerUseCase,
    AuthenticateOwnerUseCase,
  ],
})
export class HttpModule {}
