import { Module } from '@nestjs/common'

import { ShortenUrlUseCase } from '@/domain/shorten/application/use-cases/shorten-url'

import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { ShortenUrlController } from './controllers/shorten-url.controller'

@Module({
  imports: [DatabaseModule, EnvModule],
  controllers: [ShortenUrlController],
  providers: [ShortenUrlUseCase],
})
export class HttpModule {}
