import { IsString } from 'class-validator';

export class ChatEntity {
  @IsString()
  message: string;

  @IsString()
  roomId: string;

  @IsString()
  userId: string;
}
