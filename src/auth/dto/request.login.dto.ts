import { ApiProperty } from '@nestjs/swagger';

export class RequestLoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
