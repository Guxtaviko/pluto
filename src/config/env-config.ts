import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.number({
    coerce: true,
  }),
})

export type EnvConfig = z.infer<typeof envSchema>
