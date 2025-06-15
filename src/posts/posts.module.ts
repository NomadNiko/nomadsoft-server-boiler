import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { RelationalPostPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [RelationalPostPersistenceModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, RelationalPostPersistenceModule],
})
export class PostsModule {}