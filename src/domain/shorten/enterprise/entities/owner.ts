import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface OwnerProps {
  name: string
  email: string
  password: string
}

export class Owner extends Entity<OwnerProps> {
  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  static create(props: OwnerProps, id?: UniqueEntityID): Owner {
    return new Owner(props, id)
  }
}
