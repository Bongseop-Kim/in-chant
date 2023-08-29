import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/users.entity';

export class CreateUserDto extends PickType(UserEntity, [
  'name',
  'email',
  'password',
]) {}
