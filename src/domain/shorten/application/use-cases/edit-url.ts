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
  urlCode: string
  baseUrl: string
  newCode: string
}

type EditUrlResponseUseCase = Either<CodeAlreadyExistsError, { url: Url }>

@Injectable()
export class EditUrlUseCase {
  constructor(private urlRepository: UrlsRepository) {}

  async execute({
    ownerId,
    urlCode,
    baseUrl,
    newCode,
  }: EditUrlRequestUseCase): Promise<EditUrlResponseUseCase> {
    const urlExists = await this.urlRepository.findByCode(newCode)

    if (urlExists) {
      return left(new CodeAlreadyExistsError(urlExists.code.toString()))
    }

    const url = await this.urlRepository.findByCode(urlCode)

    if (!url) {
      return left(new ResourceNotFoundError())
    }

    if (!url.ownerId || url.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    url.baseUrl = baseUrl
    url.code = new NanoID(newCode)

    await this.urlRepository.save(url, urlCode)

    return right({
      url,
    })
  }
}
