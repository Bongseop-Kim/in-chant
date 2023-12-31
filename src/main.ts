import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const { project_id = '', private_key = '', client_email = '' } = process.env;
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: project_id,
      clientEmail: client_email,
      privateKey: private_key,
    }),
  });

  app.enableCors({
    origin: true,
    //원하는 주소만 origin에 입력하여 접속을 허락
    credentials: true,
  });

  await app.listen(8000);
}
bootstrap();
