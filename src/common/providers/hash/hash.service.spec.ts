import { Test, TestingModule } from '@nestjs/testing'
import { HashService } from './hash.service'
import * as argon from 'argon2'

jest.mock('argon2')

describe('HashService', () => {
  const { hash, verify } = argon as jest.Mocked<typeof argon>

  let service: HashService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile()

    service = module.get<HashService>(HashService)
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(service).toBeInstanceOf(HashService)
  })

  describe('hash', () => {
    it('should throw an error if value is not provided', async () => {
      await expect(service.hash('')).rejects.toThrow('Value is required')
    })

    it('should return a hashed value', async () => {
      const value = 'test'
      const hashedValue = 'hashedTest'

      hash.mockResolvedValue(hashedValue)

      const result = await service.hash(value)

      expect(result).toBe(hashedValue)
      expect(hash).toHaveBeenCalledWith(value)
    })
  })

  describe('compare', () => {
    it('should throw an error if digest or hash is not provided', async () => {
      await expect(
        service.compare({ digest: '', hash: 'hash' }),
      ).rejects.toThrow('Digest and hash are required')

      await expect(
        service.compare({ digest: 'digest', hash: '' }),
      ).rejects.toThrow('Digest and hash are required')
    })

    it('should return true if the digest matches the hash', async () => {
      const digest = 'digest'
      const hashValue = 'hash'
      verify.mockResolvedValue(true)

      const result = await service.compare({ digest, hash: hashValue })

      expect(result).toBe(true)
      expect(verify).toHaveBeenCalledWith(hashValue, digest)
    })

    it('should return false if the digest does not match the hash', async () => {
      const digest = 'digest'
      const hashValue = 'hash'
      verify.mockResolvedValue(false)

      const result = await service.compare({ digest, hash: hashValue })

      expect(result).toBe(false)
      expect(verify).toHaveBeenCalledWith(hashValue, digest)
    })
  })
})
