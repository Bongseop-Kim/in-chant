import { PickType } from '@nestjs/swagger';
import { ChatEntity } from '../entities/chat.entity';

export class CreateChatDto extends PickType(ChatEntity, [
  'message',
  'roomId',
  'userId',
]) {}
