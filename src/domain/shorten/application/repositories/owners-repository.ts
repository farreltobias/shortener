import { Owner } from '../../enterprise/entities/owner'

export abstract class OwnersRepository {
  abstract findByEmail(email: string): Promise<Owner | null>
  abstract create(owner: Owner): Promise<void>
}
