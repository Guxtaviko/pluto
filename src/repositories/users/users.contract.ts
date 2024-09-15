import { User } from '@prisma/client'

export abstract class UsersContract {
  abstract create(data: {
    email: string
    password: string
    name?: string
  }): Promise<User>
  abstract findById(id: string): Promise<User | null>

  abstract findByEmail(email: string): Promise<User | null>

  abstract update(id: string, data: { name?: string }): Promise<User>

  abstract delete(id: string): Promise<User>

  abstract updateRtHash(id: string, rtHash: string): Promise<User>
}
