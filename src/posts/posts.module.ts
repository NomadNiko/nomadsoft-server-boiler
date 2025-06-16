import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DocumentPostPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [DocumentPostPersistenceModule, UsersModule, FilesModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, DocumentPostPersistenceModule],
})
export class PostsModule {}