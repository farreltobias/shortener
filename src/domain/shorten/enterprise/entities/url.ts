import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { NanoID } from './value-objects/nano-id'

export interface UrlProps {
  baseUrl: string
  code: NanoID
  usedCount: number

  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null

  ownerId?: UniqueEntityID | null
}

export class Url extends Entity<UrlProps> {
  get baseUrl(): string {
    return this.props.baseUrl
  }

  set baseUrl(value: string) {
    this.props.baseUrl = value
    this.touch()
  }

  get code(): NanoID {
    return this.props.code
  }

  set code(value: NanoID) {
    this.props.code = value
    this.touch()
  }

  get usedCount(): number {
    return this.props.usedCount
  }

  set usedCount(value: number) {
    this.props.usedCount = value
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get deletedAt(): Date | undefined | null {
    return this.props.deletedAt
  }

  set deletedAt(value: Date | undefined | null) {
    this.props.deletedAt = value
    this.touch()
  }

  get isDeleted(): boolean {
    return !!this.deletedAt
  }

  get ownerId(): UniqueEntityID | undefined | null {
    return this.props.ownerId
  }

  set ownerId(value: UniqueEntityID | undefined | null) {
    this.props.ownerId = value
    this.touch()
  }

  static create(
    props: Optional<UrlProps, 'usedCount' | 'createdAt'>,
    id?: UniqueEntityID,
  ): Url {
    return new Url(
      {
        ...props,
        usedCount: props.usedCount ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
