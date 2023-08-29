import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/users.entity';
import { RoomEntity } from 'src/rooms/entities/room.entity';

@WebSocketGateway()
export class ChatsGateway {
  private logger = new Logger('chat');
  constructor(private readonly chatsService: ChatsService) {
    this.logger.log('constructor');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected: ${socket.id} ${socket.nsp.name}`);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    // 이건 어디서 어떻게 나가는지 알아야 겠어
    // const user = await this.socketModel.findOne({ id: socket.id });
    // if (user) {
    //   socket.broadcast.emit('disconnect_user', user.username);
    //   await user.deleteOne();
    // }
    // this.logger.log(`disconnected: ${socket.id} ${socket.nsp.name}`);
  }

  afterInit() {
    this.logger.log('init');
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('new_user')
  async handleNewUser(
    @CurrentUser() user: UserEntity,
    @MessageBody() room: RoomEntity,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.chatsService.newUser(user, room);
    socket.broadcast.emit('user_connected', user.name);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @CurrentUser() user: UserEntity,
    @MessageBody() { message, roomId },
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.chatsService.createChat({
      userId: user.id,
      roomId,
      message,
    });

    socket.broadcast.emit('new_chat', {
      message,
      username: user.name,
      createdAt: socketObj.createdAt,
    });
  }
}
