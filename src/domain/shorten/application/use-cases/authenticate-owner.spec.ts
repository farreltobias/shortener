import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeOwner } from 'test/factories/make-owner'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'

import { AuthenticateOwnerUseCase } from './authenticate-owner'

let inMemoryOwnersRepository: InMemoryOwnersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateOwnerUseCase

describe('Authenticate Owner', () => {
  beforeEach(() => {
    inMemoryOwnersRepository = new InMemoryOwnersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateOwnerUseCase(
      inMemoryOwnersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a owner', async () => {
    const owner = makeOwner({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryOwnersRepository.items.push(owner)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
