import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from './domain/user';
import { UsersService } from './users.service';
import { RolesGuard } from '../roles/roles.guard';
import { infinityPagination } from '../utils/infinity-pagination';
import { AddFriendDto } from './dto/add-friend.dto';
import { SocialInfoDto } from './dto/social-info.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createProfileDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(User),
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.usersService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
    return this.usersService.findById(id);
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: User['id'],
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.usersService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: User['id']): Promise<void> {
    return this.usersService.remove(id);
  }
}

// Separate controller for user-facing social features
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Social')
@Controller({
  path: 'social',
  version: '1',
})
export class SocialController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    type: SocialInfoDto,
  })
  @Get('info')
  @HttpCode(HttpStatus.OK)
  getSocialInfo(@Request() request): Promise<SocialInfoDto> {
    return this.usersService.getSocialInfo(request.user.id);
  }

  @ApiOkResponse({
    type: [User],
    description: 'List of friends with full user details',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('friends')
  @HttpCode(HttpStatus.OK)
  getFriends(@Request() request): Promise<User[]> {
    return this.usersService.getFriends(request.user.id);
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('friends')
  @HttpCode(HttpStatus.OK)
  addFriend(
    @Request() request,
    @Body() addFriendDto: AddFriendDto,
  ): Promise<User | null> {
    return this.usersService.addFriend(request.user.id, addFriendDto.friendId);
  }

  @ApiOkResponse({
    type: User,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Delete('friends/:friendId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'friendId',
    type: String,
    required: true,
  })
  removeFriend(
    @Request() request,
    @Param('friendId') friendId: string,
  ): Promise<User | null> {
    return this.usersService.removeFriend(request.user.id, friendId);
  }
}

// Public controller for user information that doesn't require authentication
@ApiTags('Public Users')
@Controller({
  path: 'public/users',
  version: '1',
})
export class PublicUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'Get the number of friends for a user',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        friendsCount: { type: 'number' },
      },
    },
  })
  @Get(':userId/friends-count')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    description: 'The ID of the user to get friends count for',
  })
  async getFriendsCount(@Param('userId') userId: string): Promise<{ userId: string; friendsCount: number }> {
    try {
      const friendsCount = await this.usersService.getFriendsCount(userId);
      return {
        userId,
        friendsCount,
      };
    } catch (error) {
      // Return 0 friends for non-existent users
      return {
        userId,
        friendsCount: 0,
      };
    }
  }
}
