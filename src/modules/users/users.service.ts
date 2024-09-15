import { Injectable, NotFoundException } from '@nestjs/common'
import { HashService } from 'src/common/providers'
import { UsersRepository } from 'src/repositories'
import { CreateUserDto } from './dto/create-user-dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
  ) {}

  async getById(id: string) {
    const user = await this.usersRepository.findById(id)

    return user
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email)

    return user
  }

  async createUser(user: CreateUserDto, hashPassword = true) {
    const password = hashPassword
      ? await this.hashService.hash(user.password)
      : user.password

    const newUser = await this.usersRepository.create({
      ...user,
      password,
    })

    return newUser
  }

  async deleteUser(id: string) {
    const existingUser = await this.usersRepository.findById(id)
    if (!existingUser) throw new NotFoundException('User not found')

    const deletedUser = await this.usersRepository.delete(id)
    return deletedUser
  }

  async updateRtHash(id: string, rtHash: string | null) {
    return this.usersRepository.updateRtHash(id, rtHash)
  }
}
