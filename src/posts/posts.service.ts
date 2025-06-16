import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostRepository } from './infrastructure/persistence/post.repository';
import { Post } from './domain/post';
import { Comment } from './domain/comment';
import { User } from '../users/domain/user';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { FilesService } from '../files/files.service';
import { HiddenUsersService } from '../hidden-users/hidden-users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly filesService: FilesService,
    private readonly hiddenUsersService: HiddenUsersService,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    let images;
    
    if (createPostDto.images && createPostDto.images.length > 0) {
      images = await this.filesService.findByIds(
        createPostDto.images.map(img => img.id)
      );
    }

    return this.postRepository.create({
      ...createPostDto,
      images,
      user,
      comments: [],
    });
  }

  async findAll(query: QueryPostDto): Promise<Post[]> {
    // Get all hidden user IDs
    const hiddenUserIds = await this.hiddenUsersService.getAllHiddenUserIds();
    console.log(`[PostsService] Hidden user IDs: ${hiddenUserIds.join(', ')}`);
    
    // Get all posts
    const allPosts = await this.postRepository.findAllWithPagination({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
    console.log(`[PostsService] Total posts before filtering: ${allPosts.length}`);
    
    // Filter out posts from hidden users
    const filteredPosts = allPosts.filter(post => !hiddenUserIds.includes(post.user.id.toString()));
    console.log(`[PostsService] Posts after filtering: ${filteredPosts.length}`);
    
    return filteredPosts;
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

  async findPostsByUserIds(userIds: string[]): Promise<Post[]> {
    return this.postRepository.findByUserIds(userIds);
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own posts');
    }

    let images;
    
    if (updatePostDto.images && updatePostDto.images.length > 0) {
      images = await this.filesService.findByIds(
        updatePostDto.images.map(img => img.id)
      );
    } else if (updatePostDto.images && updatePostDto.images.length === 0) {
      // Explicitly setting to empty array to clear images
      images = [];
    }

    const updateData = {
      ...updatePostDto,
      ...(images !== undefined && { images }),
    };

    return this.postRepository.update(id, updateData);
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