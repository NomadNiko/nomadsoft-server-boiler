import { ApiProperty } from '@nestjs/swagger';

export class HiddenUserStatusDto {
  @ApiProperty({
    type: Boolean,
    description: 'Whether the current user is hidden from All Posts API',
    example: true,
  })
  isHidden: boolean;
}