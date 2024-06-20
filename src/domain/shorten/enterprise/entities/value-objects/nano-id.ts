import { nanoid } from 'nanoid'

export class NanoID {
  private value: string

  toString(): string {
    return this.value
  }

  toValue(): string {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? nanoid(6)
  }

  equals(id: NanoID): boolean {
    return id.toValue() === this.value
  }
}
