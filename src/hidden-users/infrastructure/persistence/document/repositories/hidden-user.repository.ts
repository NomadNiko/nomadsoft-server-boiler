import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HiddenUserRepository } from '../../hidden-user.repository';
import { HiddenUser } from '../../../../domain/hidden-user';
import { HiddenUserSchemaClass, HiddenUserSchemaDocument } from '../entities/hidden-user.schema';
import { HiddenUserMapper } from '../mappers/hidden-user.mapper';
import { User } from '../../../../../users/domain/user';

@Injectable()
export class HiddenUserDocumentRepository implements HiddenUserRepository {
  constructor(
    @InjectModel(HiddenUserSchemaClass.name)
    private readonly hiddenUserModel: Model<HiddenUserSchemaDocument>,
  ) {}

  async create(data: { user: User }): Promise<HiddenUser> {
    const persistenceModel = new this.hiddenUserModel({
      user: data.user.id,
    });
    const createdHiddenUser = await persistenceModel.save();
    const populatedHiddenUser = await createdHiddenUser.populate('user');
    return HiddenUserMapper.toDomain(populatedHiddenUser as any);
  }

  async findByUserId(userId: User['id']): Promise<HiddenUser | null> {
    const hiddenUserObject = await this.hiddenUserModel
      .findOne({ user: userId })
      .populate('user')
      .exec();

    return hiddenUserObject ? HiddenUserMapper.toDomain(hiddenUserObject as any) : null;
  }

  async remove(userId: User['id']): Promise<void> {
    await this.hiddenUserModel.deleteOne({ user: userId }).exec();
  }

  async getAllHiddenUserIds(): Promise<string[]> {
    const hiddenUsers = await this.hiddenUserModel
      .find({}, { user: 1 })
      .exec();
    
    return hiddenUsers.map(hu => hu.user.toString());
  }
}