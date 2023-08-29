import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RoomEntity {
  @IsNumber()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  password: string;
}
