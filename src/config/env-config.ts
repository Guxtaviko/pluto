import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.number({
    coerce: true,
  }),
  // JWT
  JWT_SECRET: z.string(),
  JWT_RT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_RT_EXPIRES_IN: z.string(),
})

export type EnvConfig = z.infer<typeof envSchema>
