import { z } from 'zod'
import { ConfigService } from '../config.service'

describe('ConfigService', () => {
  const originalEnv = process.env
  const schema = z.object({
    NODE_ENV: z.string(),
    PORT: z.number({ coerce: true }),
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('Should return an instance of ConfigService, when provided with a schema and values', () => {
    const values = {
      NODE_ENV: 'development',
      PORT: '3000',
    } as Record<string, unknown>

    const configService = new ConfigService(schema, values)

    expect(configService).toBeDefined()
    expect(configService).toBeInstanceOf(ConfigService)

    expect(configService.get('NODE_ENV')).toBe('development')
    expect(configService.get('PORT')).toBe(3000)
  })

  it('Should throw an error, when provided with invalid values', () => {
    const values = {
      PORT: 'invalid',
    } as Record<string, unknown>

    expect(() => new ConfigService(schema, values)).toThrow()
  })

  it('Should return an instance of ConfigService, when provided with a schema and process.env', () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'development',
      PORT: '3000',
    }

    const configService = new ConfigService(schema)

    expect(configService).toBeDefined()
    expect(configService).toBeInstanceOf(ConfigService)

    expect(configService.get('NODE_ENV')).toBe('development')
    expect(configService.get('PORT')).toBe(3000)
  })
})
