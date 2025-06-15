import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PostSchemaClass } from '../entities/post.schema';
import { PostMapper } from '../mappers/post.mapper';
import { Post } from '../../../../domain/post';
import { Comment } from '../../../../domain/comment';
import { User } from '../../../../../users/domain/user';
import { PostRepository } from '../../post.repository';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PostsDocumentRepository implements PostRepository {
  constructor(
    @InjectModel(PostSchemaClass.name)
    private readonly postModel: Model<PostSchemaClass>,
  ) {}

  async create(data: Omit<DeepPartial<Post>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const createPostData = {
      name: data.name,
      content: data.content,
      imageUrl: data.imageUrl,
      user: UserMapper.toPersistence(data.user as User),
      comments: [],
    };

    const createdPost = new this.postModel(createPostData);
    const savedPost = await createdPost.save();
    
    await savedPost.populate('user');
    return PostMapper.toDomain(savedPost);
  }

  async findAllWithPagination(paginationOptions: IPaginationOptions): Promise<Post[]> {
    const posts = await this.postModel
      .find()
      .populate('user')
      .populate('comments.user')
      .sort({ createdAt: -1 })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit)
      .exec();

    return posts.map((post) => PostMapper.toDomain(post));
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.postModel
      .findById(id)
      .populate('user')
      .populate('comments.user')
      .exec();

    return post ? PostMapper.toDomain(post) : null;
  }

  async findByUser(user: User): Promise<Post[]> {
    const posts = await this.postModel
      .find({ user: new Types.ObjectId(user.id.toString()) })
      .populate('user')
      .populate('comments.user')
      .sort({ createdAt: -1 })
      .exec();

    return posts.map((post) => PostMapper.toDomain(post));
  }

  async update(id: string, payload: DeepPartial<Post>): Promise<Post> {
    const updateData: any = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.content !== undefined) updateData.content = payload.content;
    if (payload.imageUrl !== undefined) updateData.imageUrl = payload.imageUrl;
    updateData.updatedAt = new Date();

    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('user')
      .populate('comments.user')
      .exec();

    if (!updatedPost) {
      throw new Error('Post not found');
    }

    return PostMapper.toDomain(updatedPost);
  }

  async remove(id: string): Promise<void> {
    await this.postModel.findByIdAndDelete(id).exec();
  }

  async addComment(
    postId: string,
    commentData: Omit<DeepPartial<Comment>, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Comment> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new Error('Post not found');
    }

    const newComment = {
      _id: new Types.ObjectId(),
      content: commentData.content as string,
      user: new Types.ObjectId((commentData.user as User).id.toString()) as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the comment user and return
    await post.populate('comments.user');
    const savedComment = post.comments[post.comments.length - 1];
    
    const comment = new Comment({});
    comment.id = savedComment._id?.toString() || '';
    comment.content = savedComment.content;
    comment.user = UserMapper.toDomain(savedComment.user as any);
    comment.createdAt = savedComment.createdAt;
    comment.updatedAt = savedComment.updatedAt;

    return comment;
  }

  async removeComment(postId: string, commentId: string): Promise<void> {
    await this.postModel
      .findByIdAndUpdate(
        postId,
        { $pull: { comments: { _id: new Types.ObjectId(commentId) } } },
        { new: true }
      )
      .exec();
  }
}