import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { CommentEntity } from '../entities/comment.entity';
import { PostMapper } from '../mappers/post.mapper';
import { CommentMapper } from '../mappers/comment.mapper';
import { Post } from '../../../../domain/post';
import { Comment } from '../../../../domain/comment';
import { User } from '../../../../../users/domain/user';
import { PostRepository } from '../../post.repository';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PostsRelationalRepository implements PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async create(data: Omit<DeepPartial<Post>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const persistenceModel = PostMapper.toPersistence(data as Post);
    const newEntity = await this.postRepository.save(
      this.postRepository.create(persistenceModel),
    );
    return PostMapper.toDomain(newEntity);
  }

  async findAllWithPagination(paginationOptions: IPaginationOptions): Promise<Post[]> {
    const entities = await this.postRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['comments', 'comments.user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return entities.map((entity) => PostMapper.toDomain(entity));
  }

  async findById(id: string): Promise<Post | null> {
    const entity = await this.postRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.user'],
    });

    return entity ? PostMapper.toDomain(entity) : null;
  }

  async findByUser(user: User): Promise<Post[]> {
    const entities = await this.postRepository.find({
      where: {
        user: {
          id: Number(user.id),
        },
      },
      relations: ['comments', 'comments.user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return entities.map((entity) => PostMapper.toDomain(entity));
  }

  async update(id: string, payload: DeepPartial<Post>): Promise<Post> {
    const entity = await this.postRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Post not found');
    }

    // Convert domain payload to persistence payload
    const persistencePayload: Partial<PostEntity> = {};
    if (payload.name !== undefined) persistencePayload.name = payload.name;
    if (payload.content !== undefined) persistencePayload.content = payload.content;
    if (payload.imageUrl !== undefined) persistencePayload.imageUrl = payload.imageUrl;

    const updatedEntity = await this.postRepository.save(
      this.postRepository.merge(entity, persistencePayload),
    );

    return PostMapper.toDomain(updatedEntity);
  }

  async remove(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }

  async addComment(
    postId: string,
    commentData: Omit<DeepPartial<Comment>, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const comment = new CommentEntity();
    comment.content = commentData.content as string;
    comment.user = UserMapper.toPersistence(commentData.user as User);
    comment.post = post;

    const savedComment = await this.commentRepository.save(comment);
    return CommentMapper.toDomain(savedComment);
  }

  async removeComment(postId: string, commentId: string): Promise<void> {
    await this.commentRepository.delete({
      id: commentId,
      post: { id: postId },
    });
  }
}