import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common'
import type { Response } from 'express'

import { GetUrlByCodeUseCase } from '@/domain/shorten/application/use-cases/get-url-by-code'
import { Public } from '@/infra/auth/public'

@Controller('/:code')
@Public()
export class RedirectController {
  constructor(private getUrlByCode: GetUrlByCodeUseCase) {}

  @Get()
  async handle(@Param('code') code: string, @Res() res: Response) {
    const result = await this.getUrlByCode.execute({ code })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { baseUrl } = result.value.url
    return res.redirect(baseUrl)
  }
}
