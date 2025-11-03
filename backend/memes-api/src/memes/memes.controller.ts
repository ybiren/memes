import { Controller, Post, Get, Query, Put, Param, Body } from '@nestjs/common';
import { MemesService } from './memes.service';

@Controller('memes')
export class MemesController {
  constructor(private readonly memes: MemesService) {}

  @Post('seed') seed() { return this.memes.seedFromImgflip(); }

  @Get()
  list(@Query('skip') s = '0', @Query('limit') l = '10') {
    return this.memes.list(Number(s), Number(l));
  }

  @Put(':id')
    update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.memes.updateNameById(id, body.name);
  }
}
