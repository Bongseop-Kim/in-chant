import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RequestLoginDto } from './dto/request.login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: RequestLoginDto) {
    const { email, password } = data;

    // 해당 하는 이메일이 있는지 확인
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    // password 일치 여부 확인
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { email: email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
