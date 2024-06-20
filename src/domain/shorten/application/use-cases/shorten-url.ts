import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Url } from '../../enterprise/entities/url'
import { UrlOwner } from '../../enterprise/entities/url-owner'
import { NanoID } from '../../enterprise/entities/value-objects/nano-id'
import { UrlsRepository } from '../repositories/urls-repository'

interface ShortenUrlRequestUseCase {
  baseUrl: string
  ownerId?: string
  customCode?: string
}

type ShortenUrlResponseUseCase = Either<null, { url: Url }>

@Injectable()
export class ShortenUrlUseCase {
  constructor(private urlRepository: UrlsRepository) {}

  async execute({
    baseUrl,
    ownerId,
    customCode,
  }: ShortenUrlRequestUseCase): Promise<ShortenUrlResponseUseCase> {
    const code = ownerId && customCode ? new NanoID(customCode) : new NanoID()

    const url = Url.create({
      baseUrl,
      code,
    })

    if (ownerId) {
      const urlOwner = UrlOwner.create({
        ownerId: new UniqueEntityID(ownerId),
        urlId: url.id,
      })

      url.owner = urlOwner
    }

    await this.urlRepository.create(url)

    return right({ url })
  }
}
