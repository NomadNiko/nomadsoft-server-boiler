import { ApiProperty } from '@nestjs/swagger';

export class SocialInfoDto {
  @ApiProperty({
    example: 15,
    description: 'Number of posts authored by the user',
  })
  postsCount: number;

  @ApiProperty({
    example: 42,
    description: 'Number of comments left by the user on posts',
  })
  commentsCount: number;

  @ApiProperty({
    example: 8,
    description: 'Number of friends the user has',
  })
  friendsCount: number;
}