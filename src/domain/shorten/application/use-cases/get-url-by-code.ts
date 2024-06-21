import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
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
    const url = await this.urlRepository.findByCode(code)

    if (!url) {
      return left(new ResourceNotFoundError())
    }

    return right({ url })
  }
}
