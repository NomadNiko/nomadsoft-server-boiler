import { User } from '../../users/domain/user';
import { Comment } from './comment';
import { FileType } from '../../files/domain/file';

export class Post {
  id: string;
  name: string;
  content: string;
  imageUrl?: string;
  images?: FileType[];
  user: User;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}