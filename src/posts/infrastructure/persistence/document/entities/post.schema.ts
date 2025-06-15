import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';

export type PostSchemaDocument = PostSchemaClass & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class PostSchemaClass {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: String,
    required: false,
  })
  imageUrl?: string;

  @Prop({
    type: Types.ObjectId,
    ref: UserSchemaClass.name,
    required: true,
  })
  user: UserSchemaClass;

  @Prop({
    type: [{
      content: { type: String, required: true },
      user: { type: Types.ObjectId, ref: UserSchemaClass.name, required: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }],
    default: [],
  })
  comments: Array<{
    _id?: Types.ObjectId;
    content: string;
    user: UserSchemaClass;
    createdAt: Date;
    updatedAt: Date;
  }>;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(PostSchemaClass);