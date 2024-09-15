import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const createLinkSchema = z.object({
  url: z
    .string()
    .min(1, {
      message: 'URL is required',
    })
    .url({
      message: 'Invalid URL',
    }),
})

export class CreateLinkDto extends createZodDto(createLinkSchema) {}
