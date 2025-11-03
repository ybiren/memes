import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meme, MemeDocument } from './meme.schema';
import { firstValueFrom } from 'rxjs';

type ImgflipMeme = { id: string; name: string; url: string };
type ImgflipResponse = { success: boolean; data: { memes: ImgflipMeme[] } };

@Injectable()
export class MemesService {
  private readonly logger = new Logger(MemesService.name);
  constructor(
    private readonly http: HttpService,
    @InjectModel(Meme.name) private readonly memeModel: Model<MemeDocument>,
  ) {}

  async seedFromImgflip(): Promise<{ insertedOrUpdated: number }> {
    const url = process.env.IMGFLIP_URL ?? 'https://api.imgflip.com/get_memes';
    const res = await firstValueFrom(this.http.get<ImgflipResponse>(url));
    if (!res.data?.success || !Array.isArray(res.data?.data?.memes)) {
      throw new Error('Unexpected Imgflip response structure');
    }

    let c = 0;
    for (const m of res.data.data.memes) {
      await this.memeModel.updateOne(
        { imageUrl: m.url },                    // <-- פילטר לפי imageUrl
        { $set: { name: m.name, imageUrl: m.url } },
        { upsert: true },
      );
      c++;
    }
    this.logger.log(`Upserted ${c} memes`);
    return { insertedOrUpdated: c };
  }


  async list(skip = 0, limit = 10) {
    return this.memeModel.find().sort({ _id: 1 }).skip(skip).limit(limit).lean();
  }

  async updateName(externalId: string, name: string) {
    await this.memeModel.updateOne({ externalId }, { $set: { name } });
    return this.memeModel.findOne({ externalId }).lean();
  }

  async updateNameById(id: string, name: string) {
    await this.memeModel.updateOne(
      { _id: id },
      { $set: { name } }
    );
    return this.memeModel.findById(id).lean();
  }

}
