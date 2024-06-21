import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Url } from '../../enterprise/entities/url'
import { NanoID } from '../../enterprise/entities/value-objects/nano-id'
import { UrlsRepository } from '../repositories/urls-repository'
import { CodeAlreadyExistsError } from './errors/code-already-exists-error'

interface ShortenUrlRequestUseCase {
  baseUrl: string
  ownerId?: string
  customCode?: string
}

type ShortenUrlResponseUseCase = Either<CodeAlreadyExistsError, { url: Url }>

@Injectable()
export class ShortenUrlUseCase {
  constructor(private urlRepository: UrlsRepository) {}

  async execute({
    baseUrl,
    ownerId,
    customCode,
  }: ShortenUrlRequestUseCase): Promise<ShortenUrlResponseUseCase> {
    const code = ownerId && customCode ? new NanoID(customCode) : new NanoID()

    const urlExists = await this.urlRepository.findByCode(code)

    if (urlExists) {
      return left(new CodeAlreadyExistsError(code.toString()))
    }

    const url = Url.create({
      baseUrl,
      code,
      ownerId: ownerId ? new UniqueEntityID(ownerId) : null,
    })

    await this.urlRepository.create(url)

    return right({ url })
  }
}
