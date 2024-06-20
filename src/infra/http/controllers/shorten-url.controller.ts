import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

import { ShortenUrlUseCase } from '@/domain/shorten/application/use-cases/shorten-url'
import { EnvService } from '@/infra/env/env.service'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const ShortenUrlBodySchema = z.object({
  url: z.string().url(),
})

const bodyValidationPipe = new ZodValidationPipe(ShortenUrlBodySchema)

type ShortenUrlBody = z.infer<typeof ShortenUrlBodySchema>

@Controller('/shorten')
export class ShortenUrlController {
  constructor(
    private shortenUrl: ShortenUrlUseCase,
    private envService: EnvService,
  ) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: ShortenUrlBody) {
    const { url } = ShortenUrlBodySchema.parse(body)

    const result = await this.shortenUrl.execute({
      baseUrl: url,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const DOMAIN = this.envService.get('DOMAIN')
    const code = result.value.url.code.toString()

    return {
      shortUrl: `${DOMAIN}/${code}`,
    }
  }
}
