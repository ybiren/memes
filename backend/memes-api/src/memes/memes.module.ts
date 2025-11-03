import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Meme, MemeSchema } from './meme.schema';
import { MemesService } from './memes.service';
import { MemesController } from './memes.controller';


@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Meme.name, schema: MemeSchema }]),
  ],
  controllers: [MemesController],
  providers: [MemesService],
})
export class MemesModule {}
