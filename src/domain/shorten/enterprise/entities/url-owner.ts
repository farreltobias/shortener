import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface UrlOwnerProps {
  ownerId: UniqueEntityID
  urlId: UniqueEntityID
}

export class UrlOwner extends Entity<UrlOwnerProps> {
  get ownerId(): UniqueEntityID {
    return this.props.ownerId
  }

  get urlId(): UniqueEntityID {
    return this.props.urlId
  }

  static create(props: UrlOwnerProps, id?: UniqueEntityID): UrlOwner {
    return new UrlOwner(props, id)
  }
}
