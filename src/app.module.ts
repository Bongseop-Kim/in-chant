import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [UsersModule, AuthModule, ChatsModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
