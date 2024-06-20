import { UseCaseError } from '@/core/errors/use-case-error'

export class OwnerAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Owner "${identifier}" already exists.`)
  }
}
