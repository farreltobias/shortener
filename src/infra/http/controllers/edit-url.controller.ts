import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger'
import { z } from 'zod'

import { EditUrlUseCase } from '@/domain/shorten/application/use-cases/edit-url'
import { CodeAlreadyExistsError } from '@/domain/shorten/application/use-cases/errors/code-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const EditUrlBodySchema = z.object({
  url: z.string().url(),
  code: z
    .string()
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only alphanumeric characters are allowed')
    .min(3)
    .max(10),
})

const bodyValidationPipe = new ZodValidationPipe(EditUrlBodySchema)

type EditUrlBody = z.infer<typeof EditUrlBodySchema>

@Controller('/:code')
export class EditUrlController {
  constructor(private editUrl: EditUrlUseCase) {}

  @Put()
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', format: 'url' },
        code: { type: 'string', minLength: 3, maxLength: 10 },
      },
      required: ['url', 'code'],
    },
  })
  @ApiResponse({
    status: 204,
    description: 'The URL was successfully edited',
  })
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
      const error = result.value

      switch (error.constructor) {
        case CodeAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
