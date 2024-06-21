import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger'
import { z } from 'zod'

import { CodeAlreadyExistsError } from '@/domain/shorten/application/use-cases/errors/code-already-exists-error'
import { ShortenUrlUseCase } from '@/domain/shorten/application/use-cases/shorten-url'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Public } from '@/infra/auth/public'
import { EnvService } from '@/infra/env/env.service'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UrlShortenPresenter } from '../presenters/url-shorten-presenter'

const ShortenUrlBodySchema = z.object({
  url: z.string().url(),
  code: z.string().min(3).max(10).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(ShortenUrlBodySchema)

type ShortenUrlBody = z.infer<typeof ShortenUrlBodySchema>

@Controller('/shorten')
@Public()
export class ShortenUrlController {
  constructor(
    private shortenUrl: ShortenUrlUseCase,
    private envService: EnvService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', format: 'url', example: 'https://example.com' },
        code: { type: 'string', minLength: 3, maxLength: 10 },
      },
      required: ['url'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The shortened URL was successfully created',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          format: 'url',
          example: 'https://short.farrel.tech/abc123',
        },
      },
    },
  })
  async handle(
    @Body(bodyValidationPipe) body: ShortenUrlBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { url, code: customCode } = ShortenUrlBodySchema.parse(body)

    const result = await this.shortenUrl.execute({
      baseUrl: url,
      ownerId: user?.sub,
      customCode,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CodeAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const DOMAIN = this.envService.get('DOMAIN')

    return UrlShortenPresenter.toHTTP(DOMAIN, result.value.url)
  }
}
