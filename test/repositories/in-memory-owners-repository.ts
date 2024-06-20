import { DomainEvents } from '@/core/events/domain-events'
import { OwnersRepository } from '@/domain/shorten/application/repositories/owners-repository'
import { Owner } from '@/domain/shorten/enterprise/entities/owner'

export class InMemoryOwnersRepository implements OwnersRepository {
  public items: Owner[] = []

  async findByEmail(email: string) {
    const owner = this.items.find((item) => item.email === email)

    if (!owner) {
      return null
    }

    return owner
  }

  async create(owner: Owner) {
    this.items.push(owner)

    DomainEvents.dispatchEventsForAggregate(owner.id)
  }
}
