import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email({
    message: 'Invalid email',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

export class LoginDto extends createZodDto(loginSchema) {}
