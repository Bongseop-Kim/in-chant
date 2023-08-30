import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const { title, password } = createRoomDto;
    const room = await this.prisma.room.create({
      data: { title, password },
    });

    return room;
  }

  async createUsersOnRooms({ roomId, userId }) {
    await this.prisma.chat.create({
      data: { userId, roomId },
    });
  }

  async findAll() {
    const rooms = await this.prisma.room.findMany();
    return rooms;
  }

  async findById(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        chat: true,
      },
    });

    const users = await Promise.all(
      room?.chat.map(async (item) => {
        return await this.prisma.user.findUnique({
          where: { id: item.userId },
        });
      }),
    );

    return { ...room, users };
  }

  async remove(id: string) {
    await this.prisma.room.delete({
      where: {
        id,
      },
    });
  }
}
