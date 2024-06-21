import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common'
import type { Response } from 'express'

import { UseUrlUseCase } from '@/domain/shorten/application/use-cases/use-url'
import { Public } from '@/infra/auth/public'

@Controller('/:code')
@Public()
export class RedirectController {
  constructor(private useUrl: UseUrlUseCase) {}

  @Get()
  async handle(@Param('code') code: string, @Res() res: Response) {
    const result = await this.useUrl.execute({ code })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { baseUrl } = result.value.url
    return res.redirect(baseUrl)
  }
}
