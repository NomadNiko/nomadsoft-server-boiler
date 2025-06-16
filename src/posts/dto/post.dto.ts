import { UserDto } from '../../users/dto/user.dto';
import { FileDto } from '../../files/dto/file.dto';
import { Exclude, Expose, Type } from 'class-transformer';

export class CommentDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class PostDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  content: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  @Type(() => FileDto)
  images?: FileDto[];

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}