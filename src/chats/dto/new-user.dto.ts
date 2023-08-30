import { IsString } from 'class-validator';

export class NewUserDto {
  @IsString()
  roomId: string;

  @IsString()
  userId: string;

  @IsString()
  userName: string;
}
