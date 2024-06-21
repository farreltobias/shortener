import { Module } from '@nestjs/common'

import { AuthenticateOwnerUseCase } from '@/domain/shorten/application/use-cases/authenticate-owner'
import { DeleteUrlUseCase } from '@/domain/shorten/application/use-cases/delete-url'
import { EditUrlUseCase } from '@/domain/shorten/application/use-cases/edit-url'
import { FetchRecentUrlsUseCase } from '@/domain/shorten/application/use-cases/fetch-recent-urls'
import { RegisterOwnerUseCase } from '@/domain/shorten/application/use-cases/register-owner'
import { ShortenUrlUseCase } from '@/domain/shorten/application/use-cases/shorten-url'
import { UseUrlUseCase } from '@/domain/shorten/application/use-cases/use-url'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { DeleteUrlController } from './controllers/delete-question.controller'
import { EditUrlController } from './controllers/edit-url.controller'
import { FetchRecentUrlsController } from './controllers/fetch-recent-urls.controller'
import { RedirectController } from './controllers/redirect.controller'
import { ShortenUrlController } from './controllers/shorten-url.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    ShortenUrlController,
    RedirectController,
    CreateAccountController,
    AuthenticateController,
    EditUrlController,
    DeleteUrlController,
    FetchRecentUrlsController,
  ],
  providers: [
    ShortenUrlUseCase,
    UseUrlUseCase,
    RegisterOwnerUseCase,
    AuthenticateOwnerUseCase,
    EditUrlUseCase,
    DeleteUrlUseCase,
    FetchRecentUrlsUseCase,
  ],
})
export class HttpModule {}
