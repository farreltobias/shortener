import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger'
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
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    schema: {
      type: 'string',
      default: '1',
      minimum: 1,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The list of recent URLs',
    schema: {
      type: 'object',
      properties: {
        urls: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              baseUrl: {
                type: 'string',
                format: 'url',
                example: 'https://example.com',
              },
              shortUrl: {
                type: 'string',
                format: 'url',
                example: 'https://short.farrel.tech/abc123',
              },
              usedCount: {
                type: 'number',
                example: 0,
              },
            },
          },
        },
      },
    },
  })
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
