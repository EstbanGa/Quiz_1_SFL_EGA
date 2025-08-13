import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // carga las variables de .env

    MongooseModule.forRoot(process.env.MONGO_URL!),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
