import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { NewUserDto } from './dto/new-user.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({ cors: true })
export class ChatsGateway {
  private logger = new Logger('chat');

  @WebSocketServer()
  server: Server;

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

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() newUser: NewUserDto,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.chatsService.newUser(newUser);
    socket.broadcast
      .to(newUser.roomId)
      .emit('user_connected', newUser.userName);
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(@MessageBody() createChat: CreateChatDto) {
    const socketObj = await this.chatsService.createChat(createChat);
    console.log('메시지 발송' + createChat.message);

    this.server.emit(createChat.roomId, {
      message: socketObj.message,
      createdAt: socketObj.createdAt,
      userName: socketObj.userName,
      userId: socketObj.userId,
    });
  }
}
