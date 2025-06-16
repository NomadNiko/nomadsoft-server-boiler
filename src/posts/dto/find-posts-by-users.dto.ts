import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindPostsByUsersDto {
  @ApiProperty({
    type: [String],
    example: ['user-id-1', 'user-id-2'],
    description: 'Array of user IDs to fetch posts from'
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  userIds: string[];
}