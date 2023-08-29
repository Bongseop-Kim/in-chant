import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [UsersModule, AuthModule, ChatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
