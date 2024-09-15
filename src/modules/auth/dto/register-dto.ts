import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email({
      message: 'Invalid email',
    }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
})

export class RegisterDto extends createZodDto(registerSchema) {}
