import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/common/providers'
import { UsersContract } from './users.contract'

@Injectable()
export class UsersRepository implements UsersContract {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async create(data: {
    email: string
    password: string
    name?: string
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    })
  }

  async update(id: string, data: { name?: string }): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    })
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    })
  }

  async updateRtHash(id: string, rtHash: string | null): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        rtHash,
      },
    })
  }
}
