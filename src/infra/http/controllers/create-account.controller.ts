import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { OwnerAlreadyExistsError } from '@/domain/shorten/application/use-cases/errors/owner-already-exists-error'
import { RegisterOwnerUseCase } from '@/domain/shorten/application/use-cases/register-owner'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const CreateAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBody = z.infer<typeof CreateAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerOwner: RegisterOwnerUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateAccountBodySchema))
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    const result = await this.registerOwner.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OwnerAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
