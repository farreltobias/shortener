import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NanoID } from '@/core/entities/nano-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Url } from '../../enterprise/entities/url'
import { UrlsRepository } from '../repositories/urls-repository'

interface GetUrlByCodeRequestUseCase {
  code: string
}

type GetUrlByCodeResponseUseCase = Either<ResourceNotFoundError, { url: Url }>

@Injectable()
export class GetUrlByCodeUseCase {
  constructor(private urlRepository: UrlsRepository) {}

  async execute({
    code,
  }: GetUrlByCodeRequestUseCase): Promise<GetUrlByCodeResponseUseCase> {
    const nanoid = new NanoID(code)

    const url = await this.urlRepository.findByCode(nanoid)

    if (!url) {
      return left(new ResourceNotFoundError())
    }

    return right({ url })
  }
}
