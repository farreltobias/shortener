import { Module } from '@nestjs/common'

import { OwnersRepository } from '@/domain/shorten/application/repositories/owners-repository'
import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'

import { CacheModule } from '../cache/cache.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaOwnersRepository } from './prisma/repositories/prisma-owners-repository'
import { PrismaUrlsRepository } from './prisma/repositories/prisma-urls-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: UrlsRepository,
      useClass: PrismaUrlsRepository,
    },
    {
      provide: OwnersRepository,
      useClass: PrismaOwnersRepository,
    },
  ],
  exports: [PrismaService, UrlsRepository, OwnersRepository],
})
export class DatabaseModule {}
