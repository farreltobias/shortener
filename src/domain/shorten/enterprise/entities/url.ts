import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { UrlOwner } from './url-owner'

export interface UrlProps {
  longUrl: string
  shortUrl: string
  code: string
  usedCount: number

  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null

  owner?: UrlOwner | null
}

export class Url extends Entity<UrlProps> {
  get longUrl(): string {
    return this.props.longUrl
  }

  set longUrl(value: string) {
    this.props.longUrl = value
    this.touch()
  }

  get shortUrl(): string {
    return this.props.shortUrl
  }

  set shortUrl(value: string) {
    this.props.shortUrl = value
    this.touch()
  }

  get code(): string {
    return this.props.code
  }

  set code(value: string) {
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

  get owner(): UrlOwner | undefined | null {
    return this.props.owner
  }

  set owner(value: UrlOwner | undefined | null) {
    this.props.owner = value
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
