import { Post } from '../../../../domain/post';
import { Comment } from '../../../../domain/comment';
import { PostSchemaClass } from '../entities/post.schema';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { FileMapper } from '../../../../../files/infrastructure/persistence/document/mappers/file.mapper';

export class PostMapper {
  static toDomain(raw: any): Post {
    const domainEntity = new Post({});
    domainEntity.id = raw._id?.toString() || raw.id?.toString();
    domainEntity.name = raw.name;
    domainEntity.content = raw.content;
    domainEntity.imageUrl = raw.imageUrl;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    if (raw.images && Array.isArray(raw.images)) {
      domainEntity.images = raw.images
        .filter((image) => image && (image._id || image.id))
        .map((image) => FileMapper.toDomain(image));
    }

    if (raw.comments) {
      domainEntity.comments = raw.comments.map((comment) => {
        const commentEntity = new Comment({});
        commentEntity.id = comment._id?.toString() || '';
        commentEntity.content = comment.content;
        commentEntity.createdAt = comment.createdAt;
        commentEntity.updatedAt = comment.updatedAt;
        if (comment.user) {
          commentEntity.user = UserMapper.toDomain(comment.user);
        }
        return commentEntity;
      });
    } else {
      domainEntity.comments = [];
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Post): any {
    const persistenceEntity: any = {};
    
    if (domainEntity.id && domainEntity.id !== '') {
      persistenceEntity._id = domainEntity.id;
    }
    
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.content = domainEntity.content;
    persistenceEntity.imageUrl = domainEntity.imageUrl;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    
    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    if (domainEntity.images) {
      persistenceEntity.images = domainEntity.images.map((image) => FileMapper.toPersistence(image));
    }

    if (domainEntity.comments) {
      persistenceEntity.comments = domainEntity.comments.map((comment) => ({
        _id: comment.id,
        content: comment.content,
        user: UserMapper.toPersistence(comment.user),
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      }));
    }

    return persistenceEntity;
  }
}