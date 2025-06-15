import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CommentEntity } from './entities/comment.entity';
import { PostsRelationalRepository } from './repositories/post.repository';
import { PostRepository } from '../post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, CommentEntity])],
  providers: [
    {
      provide: PostRepository,
      useClass: PostsRelationalRepository,
    },
  ],
  exports: [PostRepository, TypeOrmModule],
})
export class RelationalPostPersistenceModule {}