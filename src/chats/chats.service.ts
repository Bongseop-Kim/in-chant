import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewUserDto } from './dto/new-user.dto';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async newUser(newUser: NewUserDto) {
    await this.prisma.chat.create({
      data: {
        userId: newUser.userId,
        roomId: newUser.roomId,
      },
    });
  }

  async createChat(data: CreateChatDto) {
    return await this.prisma.chat.create({
      data,
    });
  }
}
