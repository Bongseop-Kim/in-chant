import { IsString } from 'class-validator';

export class SubmitChatDto {
  @IsString()
  roomId: string;

  @IsString()
  userId: string;
}
