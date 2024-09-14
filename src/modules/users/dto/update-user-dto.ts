import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const updateUserSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
})

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
