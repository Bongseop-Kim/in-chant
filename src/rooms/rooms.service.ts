import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const room = await this.prisma.room.create({
      data: createRoomDto,
    });

    return room;
  }

  async registerRoom({ roomId, userId }) {
    await this.prisma.member.create({
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

    return room;
  }

  async remove(id: string) {
    await this.prisma.room.delete({
      where: {
        id,
      },
    });
  }
}
