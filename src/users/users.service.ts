import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { User } from './domain/user';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCreateService } from './services/user-create.service';
import { UserReadService } from './services/user-read.service';
import { UserUpdateService } from './services/user-update.service';
import { UserDeleteService } from './services/user-delete.service';
import { PostRepository } from '../posts/infrastructure/persistence/post.repository';
import { SocialInfoDto } from './dto/social-info.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userCreateService: UserCreateService,
    private readonly userReadService: UserReadService,
    private readonly userUpdateService: UserUpdateService,
    private readonly userDeleteService: UserDeleteService,
    private readonly postRepository: PostRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userCreateService.create(createUserDto);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.userReadService.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.userReadService.findById(id);
  }

  findByIds(ids: User['id'][]): Promise<User[]> {
    return this.userReadService.findByIds(ids);
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.userReadService.findByEmail(email);
  }

  findByUsername(username: User['username']): Promise<NullableType<User>> {
    return this.userReadService.findByUsername(username);
  }

  findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    return this.userReadService.findBySocialIdAndProvider({
      socialId,
      provider,
    });
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userUpdateService.update(id, updateUserDto);
  }

  async remove(id: User['id']): Promise<void> {
    await this.userDeleteService.remove(id);
  }

  async addFriend(userId: User['id'], friendId: User['id']): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    // Check if friend exists
    const friend = await this.findById(friendId);
    if (!friend) {
      throw new Error('Friend user not found');
    }

    // Check if already friends
    if (user.friends?.includes(friendId as string)) {
      throw new Error('Users are already friends');
    }

    // Add friend to user's friends list
    const updatedFriends = [...(user.friends || []), friendId as string];
    return this.update(userId, { friends: updatedFriends });
  }

  async removeFriend(userId: User['id'], friendId: User['id']): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    // Remove friend from user's friends list
    const updatedFriends = (user.friends || []).filter(id => id !== friendId);
    return this.update(userId, { friends: updatedFriends });
  }

  async getFriends(userId: User['id']): Promise<User[]> {
    const user = await this.findById(userId);
    if (!user || !user.friends?.length) {
      return [];
    }

    // Get full user objects for all friends
    return this.findByIds(user.friends);
  }

  async getSocialInfo(userId: User['id']): Promise<SocialInfoDto> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get posts count
    const userPosts = await this.postRepository.findByUser(user);
    const postsCount = userPosts.length;

    // Get comments count by counting comments across all posts where user is the commenter
    const allPosts = await this.postRepository.findAllWithPagination({ page: 1, limit: 1000 });
    const commentsCount = allPosts.reduce((count, post) => {
      return count + (post.comments?.filter(comment => comment.user.id === userId).length || 0);
    }, 0);

    // Get friends count
    const friendsCount = user.friends?.length || 0;

    return {
      postsCount,
      commentsCount,
      friendsCount,
    };
  }

  async getFriendsCount(userId: User['id']): Promise<number> {
    const user = await this.findById(userId);
    if (!user) {
      return 0;
    }
    return user.friends?.length || 0;
  }
}
