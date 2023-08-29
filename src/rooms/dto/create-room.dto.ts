import { PickType } from '@nestjs/swagger';
import { RoomEntity } from '../entities/room.entity';

export class CreateRoomDto extends PickType(RoomEntity, [
  'title',
  'password',
]) {}
