import { HiddenUser } from '../../domain/hidden-user';
import { User } from '../../../users/domain/user';

export abstract class HiddenUserRepository {
  abstract create(data: { user: User }): Promise<HiddenUser>;
  abstract findByUserId(userId: User['id']): Promise<HiddenUser | null>;
  abstract remove(userId: User['id']): Promise<void>;
  abstract getAllHiddenUserIds(): Promise<string[]>;
}