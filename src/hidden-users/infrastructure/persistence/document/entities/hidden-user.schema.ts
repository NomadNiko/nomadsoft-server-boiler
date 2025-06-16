import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';

export type HiddenUserSchemaDocument = HydratedDocument<HiddenUserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class HiddenUserSchemaClass {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'UserSchemaClass',
    required: true,
    unique: true,
    index: true,
  })
  user: UserSchemaClass;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const HiddenUserSchema = SchemaFactory.createForClass(HiddenUserSchemaClass);