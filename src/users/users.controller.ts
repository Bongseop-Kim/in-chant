import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from './dto/users.dto';
import { RequestLoginDto } from 'src/auth/dto/request.login.dto';
import { SuccessInterceptor } from 'src/common/interceptor/success.interceptor';
import { UserEntity } from './entities/users.entity';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() User: UserEntity) {
    return User;
  }

  @Post('signup')
  async clientSignUp(@Body() body: CreateUserDto) {
    return await this.usersService.clientSignUp(body);
  }

  @Post('login')
  async logIn(@Body() data: RequestLoginDto) {
    return await this.authService.jwtLogIn(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  getUserInfo(@CurrentUser() User) {
    return this.usersService.getUserInfo(User.id);
  }
}
