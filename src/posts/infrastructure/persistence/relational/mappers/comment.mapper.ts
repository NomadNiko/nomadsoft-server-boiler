import { Comment } from '../../../../domain/comment';
import { CommentEntity } from '../entities/comment.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

export class CommentMapper {
  static toDomain(raw: CommentEntity): Comment {
    const domainEntity = new Comment({});
    domainEntity.id = raw.id;
    domainEntity.content = raw.content;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Comment): CommentEntity {
    const persistenceEntity = new CommentEntity();
    
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    
    persistenceEntity.content = domainEntity.content;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    
    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    return persistenceEntity;
  }
}