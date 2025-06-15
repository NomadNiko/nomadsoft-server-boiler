import { User } from '../../users/domain/user';
import { Comment } from './comment';

export class Post {
  id: string;
  name: string;
  content: string;
  imageUrl?: string;
  user: User;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}