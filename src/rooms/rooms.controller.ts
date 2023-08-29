import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/users.entity';
import { SuccessInterceptor } from 'src/common/interceptor/success.interceptor';

@Controller('rooms')
@UseInterceptors(SuccessInterceptor)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @CurrentUser() user: UserEntity,
  ) {
    const room = await this.roomsService.createRoom(createRoomDto);
    const roomId = room.id;
    const userId = user.id;
    await this.roomsService.createUsersOnRooms({
      roomId,
      userId,
    });
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.roomsService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.roomsService.remove(id);
  }
}
