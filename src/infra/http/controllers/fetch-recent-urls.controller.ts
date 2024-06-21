import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'

import { FetchRecentUrlsUseCase } from '@/domain/shorten/application/use-cases/fetch-recent-urls'
import { EnvService } from '@/infra/env/env.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { UrlDetailsPresenter } from '../presenters/url-details-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

@Controller('/urls/list')
export class FetchRecentUrlsController {
  constructor(
    private fetchRecentUrls: FetchRecentUrlsUseCase,
    private envService: EnvService,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    const result = await this.fetchRecentUrls.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { urls } = result.value
    const DOMAIN = this.envService.get('DOMAIN')

    return { urls: urls.map((url) => UrlDetailsPresenter.toHTTP(DOMAIN, url)) }
  }
}
