import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchemaClass, PostSchema } from './entities/post.schema';
import { PostsDocumentRepository } from './repositories/post.repository';
import { PostRepository } from '../post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostSchemaClass.name, schema: PostSchema },
    ]),
  ],
  providers: [
    {
      provide: PostRepository,
      useClass: PostsDocumentRepository,
    },
  ],
  exports: [PostRepository, MongooseModule],
})
export class DocumentPostPersistenceModule {}