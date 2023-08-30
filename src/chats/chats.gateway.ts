import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { NewUserDto } from './dto/new-user.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({ cors: true })
export class ChatsGateway {
  private logger = new Logger('chat');
  constructor(private readonly chatsService: ChatsService) {
    this.logger.log('constructor');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected: ${socket.id} ${socket.nsp.name}`);
  }

  // async handleDisconnect(@ConnectedSocket() socket: Socket) {
  // 이건 어디서 어떻게 나가는지 알아야 겠어
  // const user = await this.socketModel.findOne({ id: socket.id });
  // if (user) {
  //   socket.broadcast.emit('disconnect_user', user.username);
  //   await user.deleteOne();
  // }
  // this.logger.log(`disconnected: ${socket.id} ${socket.nsp.name}`);
  // }

  afterInit() {
    this.logger.log('init');
  }

  // 소켓은 토큰을 헤더로 받을 수 없어서 바디에 아이디를 직접 보내줬다.
  // json으로 말고 객체 형태로 바로 보내줬다.

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() newUser: NewUserDto,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.chatsService.newUser(newUser);
    socket.broadcast.emit('user_connected', newUser.userName);
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() createChat: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.chatsService.createChat(createChat);

    socket.broadcast.emit('new_chat', {
      message: socketObj.message,
      // username: user.name,
      createdAt: socketObj.createdAt,
    });
  }
}
