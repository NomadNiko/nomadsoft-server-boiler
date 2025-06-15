import { User } from '../../users/domain/user';

export class Comment {
  id: string;
  user: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Comment>) {
    Object.assign(this, partial);
  }
}