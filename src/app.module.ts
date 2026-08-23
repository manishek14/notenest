import { Module } from '@nestjs/common';
import { NoteModule } from './modules/note/note.module';
import { SmsModule } from './modules/sms/sms.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    NoteModule,
    SmsModule,
  ],
})
export class AppModule {}
