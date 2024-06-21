import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Url } from '../../enterprise/entities/url'
import { NanoID } from '../../enterprise/entities/value-objects/nano-id'
import { UrlsRepository } from '../repositories/urls-repository'
import { CodeAlreadyExistsError } from './errors/code-already-exists-error'

interface EditUrlRequestUseCase {
  ownerId: string
  urlId: string
  baseUrl: string
  code: string
}

type EditUrlResponseUseCase = Either<CodeAlreadyExistsError, { url: Url }>

@Injectable()
export class EditUrlUseCase {
  constructor(private urlRepository: UrlsRepository) {}

  async execute({
    ownerId,
    urlId,
    baseUrl,
    code,
  }: EditUrlRequestUseCase): Promise<EditUrlResponseUseCase> {
    const url = await this.urlRepository.findById(urlId)

    if (!url) {
      return left(new ResourceNotFoundError())
    }

    if (url.ownerId?.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    url.baseUrl = baseUrl
    url.code = new NanoID(code)

    await this.urlRepository.save(url)

    return right({
      url,
    })
  }
}
