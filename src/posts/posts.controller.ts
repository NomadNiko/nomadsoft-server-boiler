import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { FindPostsByUsersDto } from './dto/find-posts-by-users.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  findAll(@Query() query: QueryPostDto) {
    return this.postsService.findAll(query);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('my-posts')
  findUserPosts(@Request() req) {
    return this.postsService.findUserPosts(req.user);
  }

  @ApiOperation({ summary: 'Get posts from specific users (for following/friends feeds)' })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('by-users')
  @HttpCode(HttpStatus.OK)
  findPostsByUsers(@Body() findPostsByUsersDto: FindPostsByUsersDto) {
    return this.postsService.findPostsByUserIds(findPostsByUsersDto.userIds);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req) {
    return this.postsService.update(id, updatePostDto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(id, req.user);
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  addComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.postsService.addComment(postId, createCommentDto, req.user);
  }

  @Delete(':id/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeComment(
    @Param('id') postId: string,
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    return this.postsService.removeComment(postId, commentId, req.user);
  }
}