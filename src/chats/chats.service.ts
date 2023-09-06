import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewUserDto } from './dto/new-user.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class ChatsService {
  private readonly firebaseAdmin: admin.app.App;

  constructor(private prisma: PrismaService) {}

  async newUser(newUser: NewUserDto) {
    await this.prisma.chat.create({
      data: {
        userId: newUser.userId,
        roomId: newUser.roomId,
        userName: newUser.userId,
      },
    });
  }

  async createChat(data: CreateChatDto) {
    //방 번호를 가지고 해당 방의 모든 유저들을 찾는다.

    const userOnRoom = await this.prisma.chat.findMany({
      where: {
        roomId: data.roomId,
      },
      select: {
        userId: true,
      },
    });
    const uniqueUserIds = [...new Set(userOnRoom.map((chat) => chat.userId))];
    uniqueUserIds.map(async (userId) => {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const message = {
        token: user.token,
        notification: {
          body: data.message,
          title: data.userName,
        },
      };

      if (user.token) {
        admin
          .messaging()
          .send(message)
          .then(function (response) {
            console.log('Successfully sent message: : ', response);
          })
          .catch(function (err) {
            console.log('Error Sending message!!! : ', err);
          });
      }
    });

    return await this.prisma.chat.create({
      data,
    });
  }
}
