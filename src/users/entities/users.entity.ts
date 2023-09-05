import { User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class UserEntity implements User {
  @IsNumber()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  token: string;

  @IsString()
  password: string;
}
