import { HiddenUser } from '../../../../domain/hidden-user';
import { HiddenUserSchemaClass } from '../entities/hidden-user.schema';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';

export class HiddenUserMapper {
  static toDomain(raw: HiddenUserSchemaClass & { _id: any }): HiddenUser {
    const domainEntity = new HiddenUser();
    
    domainEntity.id = raw._id.toString();
    domainEntity.user = raw.user ? UserMapper.toDomain(raw.user) : null;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: HiddenUser): HiddenUserSchemaClass & { _id?: any } {
    const persistenceEntity = new HiddenUserSchemaClass();
    
    if (domainEntity.id) {
      (persistenceEntity as any)._id = domainEntity.id;
    }
    persistenceEntity.user = domainEntity.user as any;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}