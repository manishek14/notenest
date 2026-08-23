import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const host = process.env.CORE_HOST ?? 'localhost';
  const port = parseInt(process.env.CORE_PORT ?? '4000');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());


  await app.listen(port);
  console.log(`applocation is listning on ${host}:${port}`);
}
bootstrap();
