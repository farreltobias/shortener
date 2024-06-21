import { UseCaseError } from '@/core/errors/use-case-error'

export class CodeAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`A URL with the code "${identifier}" already exists.`)
  }
}
