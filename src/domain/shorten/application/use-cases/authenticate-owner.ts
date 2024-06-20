import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { OwnersRepository } from '../repositories/owners-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateOwnerRequestUseCase {
  email: string
  password: string
}

type AuthenticateOwnerResponseUseCase = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateOwnerUseCase {
  constructor(
    private ownersRepository: OwnersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateOwnerRequestUseCase): Promise<AuthenticateOwnerResponseUseCase> {
    const owner = await this.ownersRepository.findByEmail(email)

    if (!owner) {
      return left(new WrongCredentialsError())
    }

    const isValidPassword = await this.hashComparer.compare(
      password,
      owner.password,
    )

    if (!isValidPassword) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: owner.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
