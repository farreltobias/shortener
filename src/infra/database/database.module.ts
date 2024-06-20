import { Module } from '@nestjs/common'

import { UrlsRepository } from '@/domain/shorten/application/repositories/urls-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaUrlsRepository } from './prisma/repositories/prisma-urls-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UrlsRepository,
      useClass: PrismaUrlsRepository,
    },
  ],
  exports: [PrismaService, UrlsRepository],
})
export class DatabaseModule {}
