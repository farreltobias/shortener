import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { Owner } from '../../enterprise/entities/owner'
import { HashGenerator } from '../cryptography/hash-generator'
import { OwnersRepository } from '../repositories/owners-repository'
import { OwnerAlreadyExistsError } from './errors/owner-already-exists-error'

interface RegisterOwnerRequestUseCase {
  name: string
  email: string
  password: string
}

type RegisterOwnerResponseUseCase = Either<
  OwnerAlreadyExistsError,
  { owner: Owner }
>

@Injectable()
export class RegisterOwnerUseCase {
  constructor(
    private ownersRepository: OwnersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterOwnerRequestUseCase): Promise<RegisterOwnerResponseUseCase> {
    const ownerWithSameEmail = await this.ownersRepository.findByEmail(email)

    if (ownerWithSameEmail) {
      return left(new OwnerAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const owner = Owner.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.ownersRepository.create(owner)

    return right({
      owner,
    })
  }
}
