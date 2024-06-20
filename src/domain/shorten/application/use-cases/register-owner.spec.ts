import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'

import { RegisterOwnerUseCase } from './register-owner'

let inMemoryOwnersRepository: InMemoryOwnersRepository
let fakeHasher: FakeHasher

let sut: RegisterOwnerUseCase

describe('Register Owner', () => {
  beforeEach(() => {
    inMemoryOwnersRepository = new InMemoryOwnersRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterOwnerUseCase(inMemoryOwnersRepository, fakeHasher)
  })

  it('should be able to register a new owner', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      owner: inMemoryOwnersRepository.items[0],
    })
  })

  it('should hash owner password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryOwnersRepository.items[0].password).toEqual(hashedPassword)
  })
})
