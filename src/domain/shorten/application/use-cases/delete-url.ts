import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { UrlsRepository } from '../repositories/urls-repository'

interface DeleteUrlRequestUseCase {
  ownerId: string
  urlCode: string
}

type DeleteUrlResponseUseCase = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteUrlUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    urlCode,
    ownerId,
  }: DeleteUrlRequestUseCase): Promise<DeleteUrlResponseUseCase> {
    const url = await this.urlsRepository.findByCode(urlCode)

    if (!url) {
      return left(new ResourceNotFoundError())
    }

    if (!url.ownerId || url.ownerId.toString() !== ownerId) {
      return left(new NotAllowedError())
    }

    await this.urlsRepository.delete(url)

    return right(null)
  }
}
