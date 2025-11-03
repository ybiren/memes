import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type MemeDocument = Meme & Document;

@Schema({ timestamps: true })
export class Meme {
  @Prop({ required: true }) name: string;

  // נשתמש בכתובת התמונה בתור מפתח ייחודי כדי למנוע כפילויות
  @Prop({ required: true, unique: true }) imageUrl: string;
}

export const MemeSchema = SchemaFactory.createForClass(Meme);
