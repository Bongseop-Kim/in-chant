import { User } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserEntity implements User {
  @IsNumber()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
