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

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email)

    return user
  }

  async createUser(user: CreateUserDto) {
    const password = await this.hashService.hash(user.password)

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
}
