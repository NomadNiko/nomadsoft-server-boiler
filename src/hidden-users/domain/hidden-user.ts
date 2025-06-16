import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export class HiddenUser {
  @ApiProperty({
    type: String,
    description: 'Unique identifier for the hidden user record',
  })
  id: string;

  @ApiProperty({
    type: () => User,
    description: 'User who wants to hide their posts',
  })
  user: User | null;

  @ApiProperty({
    type: Date,
    description: 'When the user was added to the hidden list',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'When the record was last updated',
  })
  updatedAt: Date;
}