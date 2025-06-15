import { Post } from '../../../../domain/post';
import { PostEntity } from '../entities/post.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { CommentMapper } from './comment.mapper';

export class PostMapper {
  static toDomain(raw: PostEntity): Post {
    const domainEntity = new Post({});
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.content = raw.content;
    domainEntity.imageUrl = raw.imageUrl;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    if (raw.comments) {
      domainEntity.comments = raw.comments.map((comment) =>
        CommentMapper.toDomain(comment),
      );
    } else {
      domainEntity.comments = [];
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Post): PostEntity {
    const persistenceEntity = new PostEntity();
    
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.content = domainEntity.content;
    persistenceEntity.imageUrl = domainEntity.imageUrl;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    
    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    if (domainEntity.comments) {
      persistenceEntity.comments = domainEntity.comments.map((comment) =>
        CommentMapper.toPersistence(comment),
      );
    }

    return persistenceEntity;
  }
}