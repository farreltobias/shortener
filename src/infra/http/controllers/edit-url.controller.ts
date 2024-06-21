import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

import { EditUrlUseCase } from '@/domain/shorten/application/use-cases/edit-url'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const EditUrlBodySchema = z.object({
  url: z.string().url(),
  code: z.string().min(3).max(10),
})

const bodyValidationPipe = new ZodValidationPipe(EditUrlBodySchema)

type EditUrlBody = z.infer<typeof EditUrlBodySchema>

@Controller('/:code')
export class EditUrlController {
  constructor(private editUrl: EditUrlUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditUrlBody,
    @CurrentUser() user: UserPayload,
    @Param('code') urlCode: string,
  ) {
    const { url, code } = body
    const { sub: userId } = user

    const result = await this.editUrl.execute({
      urlCode,
      ownerId: userId,
      baseUrl: url,
      newCode: code,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
