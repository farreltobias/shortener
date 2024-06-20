import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Url } from '../../enterprise/entities/url'
import { UrlOwner } from '../../enterprise/entities/url-owner'
import { NanoID } from '../../enterprise/entities/value-objects/nano-id'
import { OwnersRepository } from '../repositories/owners-repository'
import { UrlsRepository } from '../repositories/urls-repository'

interface ShortenUrlRequestUseCase {
  baseUrl: string
  ownerEmail?: string
  customCode?: string
}

type ShortenUrlResponseUseCase = Either<null, { url: Url }>

@Injectable()
export class ShortenUrlUseCase {
  constructor(
    private urlRepository: UrlsRepository,
    private ownerRepository: OwnersRepository,
  ) {}

  async execute({
    baseUrl,
    ownerEmail,
    customCode,
  }: ShortenUrlRequestUseCase): Promise<ShortenUrlResponseUseCase> {
    const owner = ownerEmail
      ? await this.ownerRepository.findByEmail(ownerEmail)
      : null

    const code = owner && customCode ? new NanoID(customCode) : new NanoID()

    const url = Url.create({
      baseUrl,
      code,
    })

    if (owner) {
      const urlOwner = UrlOwner.create({
        ownerId: owner.id,
        urlId: url.id,
      })

      url.owner = urlOwner
    }

    await this.urlRepository.create(url)

    return right({ url })
  }
}
