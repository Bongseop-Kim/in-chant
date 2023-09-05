import {
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-users.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //이메일 중복 검사
  async existByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
    }
    return user;
  }

  //유저 회원 가입 API 입니다.
  async clientSignUp(body: CreateUserDto) {
    const { email, name, password } = body;
    await this.existByEmail(email);

    if (name === null || '') {
      throw new HttpException('이름을 정확히 입력해 주세요', 400);
    }
    if (password === null || '') {
      throw new HttpException('비밀번호는 필수 항목입니다.', 400);
    }

    const hashedPassedword = await bcrypt.hash(password, 10);

    const user = {
      email: email,
      name: name,
      password: hashedPassedword,
    };

    const signUp = await this.prisma.user.create({
      data: {
        ...user,
      },
    });
    return signUp.email;
  }

  async updateUser(user: UserEntity, token: string) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: token,
    });
  }

  //auth에서 사용되는 API입니다.
  findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  //auth에서 사용되는 API입니다.
  findUserByIdWithoutPassword(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
