import { ZodSchema } from 'zod'

export class ConfigService<T extends Record<string, unknown>> {
  private readonly envVars: T

  constructor(private readonly envSchema: ZodSchema<T>) {
    const validation = this.envSchema.safeParse(process.env)

    if (!validation.success) {
      throw new Error(`Config validation error(s): ${validation.error.message}`)
    }

    this.envVars = validation.data
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.envVars[key]
  }
}
