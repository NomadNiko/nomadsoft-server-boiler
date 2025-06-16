import { Post } from '../../domain/post';
import { Comment } from '../../domain/comment';
import { User } from '../../../users/domain/user';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

export abstract class PostRepository {
  abstract create(data: Omit<DeepPartial<Post>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>;
  
  abstract findAllWithPagination(paginationOptions: IPaginationOptions): Promise<Post[]>;
  
  abstract findById(id: string): Promise<Post | null>;
  
  abstract findByUser(user: User): Promise<Post[]>;
  
  abstract findByUserIds(userIds: string[]): Promise<Post[]>;
  
  abstract update(id: string, payload: DeepPartial<Post>): Promise<Post>;
  
  abstract remove(id: string): Promise<void>;
  
  abstract addComment(postId: string, comment: Omit<DeepPartial<Comment>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment>;
  
  abstract removeComment(postId: string, commentId: string): Promise<void>;
}