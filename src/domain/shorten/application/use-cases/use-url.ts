import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Url } from '../../enterprise/entities/url'
import { UrlsRepository } from '../repositories/urls-repository'

interface UseUrlRequestUseCase {
  code: string
}

type UseUrlResponseUseCase = Either<ResourceNotFoundError, { url: Url }>

@Injectable()
export class UseUrlUseCase {
  constructor(private urlRepository: UrlsRepository) {}

  async execute({
    code,
  }: UseUrlRequestUseCase): Promise<UseUrlResponseUseCase> {
    const url = await this.urlRepository.findByCode(code)

    if (!url) {
      return left(new ResourceNotFoundError())
    }

    url.usedCount += 1
    await this.urlRepository.save(url)

    return right({ url })
  }
}
