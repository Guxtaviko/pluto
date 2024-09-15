import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const updateLinkSchema = z.object({
  url: z.string().min(1, {
    message: 'Url is required',
  }),
})

export class UpdateLinkDto extends createZodDto(updateLinkSchema) {}
