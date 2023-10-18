import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password, birthday }: CreateUserDTO) {
    const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
        birthday: birthday ? new Date(birthday) : null,
      },
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);

    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    { email, name, password, birthday, role }: UpdatePutUserDTO,
  ) {
    await this.exists(id);

    const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    return this.prisma.user.update({
      data: {
        email,
        name,
        password: hashPassword,
        birthday: birthday ? new Date(birthday) : null,
        role,
      },
      where: {
        id,
      },
    });
  }

  async updatePartial(
    id: number,
    { email, name, password, birthday, role }: UpdatePatchUserDTO,
  ) {
    await this.exists(id);

    const data: any = {};

    if (email) data.email = email;
    if (name) data.name = name;
    if (password)
      data.password = await bcrypt.hash(password, await bcrypt.genSalt());
    if (birthday) data.birthday = birthday;
    if (role) data.role = role;

    return this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException('O usuário não existe');
    }
  }
}
