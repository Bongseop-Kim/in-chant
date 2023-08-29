import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomEntity } from 'src/rooms/entities/room.entity';
import { UserEntity } from 'src/users/entities/users.entity';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async newUser(user: UserEntity, room: RoomEntity) {
    await this.prisma.chat.create({
      data: {
        userId: user.id,
        roomId: room.id,
      },
    });
  }

  async createChat(data: CreateChatDto) {
    return await this.prisma.chat.create({
      data,
    });
  }
}
