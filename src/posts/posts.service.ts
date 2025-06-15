import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostRepository } from './infrastructure/persistence/post.repository';
import { Post } from './domain/post';
import { Comment } from './domain/comment';
import { User } from '../users/domain/user';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryPostDto } from './dto/query-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    return this.postRepository.create({
      ...createPostDto,
      user,
      comments: [],
    });
  }

  async findAll(query: QueryPostDto): Promise<Post[]> {
    return this.postRepository.findAllWithPagination({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async findUserPosts(user: User): Promise<Post[]> {
    return this.postRepository.findByUser(user);
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.postRepository.update(id, updatePostDto);
  }

  async remove(id: string, user: User): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(id);
  }

  async addComment(postId: string, createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.postRepository.addComment(postId, {
      ...createCommentDto,
      user,
    });
  }

  async removeComment(postId: string, commentId: string, user: User): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== user.id && post.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments or comments on your posts');
    }

    await this.postRepository.removeComment(postId, commentId);
  }
}