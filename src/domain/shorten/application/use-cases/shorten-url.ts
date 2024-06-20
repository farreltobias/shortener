import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { NanoID } from '@/core/entities/nano-id'

import { Url } from '../../enterprise/entities/url'
import { UrlsRepository } from '../repositories/urls-repository'

interface ShortenUrlRequestUseCase {
  baseUrl: string
  // TODO: Add custom code for authenticated users
  // ownerId?: string
  // code?: string
}

type ShortenUrlResponseUseCase = Either<null, { url: Url }>

@Injectable()
export class ShortenUrlUseCase {
  constructor(private urlRepository: UrlsRepository) {}

  async execute({
    baseUrl,
  }: ShortenUrlRequestUseCase): Promise<ShortenUrlResponseUseCase> {
    const code = new NanoID()

    const url = Url.create({
      baseUrl,
      code,
    })

    await this.urlRepository.create(url)

    return right({ url })
  }
}
