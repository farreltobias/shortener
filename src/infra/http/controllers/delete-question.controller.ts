import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'

import { DeleteUrlUseCase } from '@/domain/shorten/application/use-cases/delete-url'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/:code')
export class DeleteUrlController {
  constructor(private deleteUrl: DeleteUrlUseCase) {}

  @Delete()
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'The URL was successfully deleted' })
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('code') urlCode: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteUrl.execute({
      urlCode,
      ownerId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
