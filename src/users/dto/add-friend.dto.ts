import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddFriendDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the user to add as friend',
  })
  @IsNotEmpty()
  @IsString()
  friendId: string;
}