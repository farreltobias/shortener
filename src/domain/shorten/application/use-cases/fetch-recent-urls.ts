import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Url } from '../../enterprise/entities/url'
import { UrlsRepository } from '../repositories/urls-repository'

interface FetchRecentUrlsRequestUseCase {
  page: number
}

type FetchRecentUrlsResponseUseCase = Either<null, { urls: Url[] }>

@Injectable()
export class FetchRecentUrlsUseCase {
  constructor(private urlsRepository: UrlsRepository) {}

  async execute({
    page,
  }: FetchRecentUrlsRequestUseCase): Promise<FetchRecentUrlsResponseUseCase> {
    const urls = await this.urlsRepository.findManyRecent({ page })

    return right({
      urls,
    })
  }
}
