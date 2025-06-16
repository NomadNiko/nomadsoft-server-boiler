import { IsNotEmpty, IsOptional, IsString, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileDto } from '../../files/dto/file.dto';

export class CreatePostDto {
  @ApiProperty({
    example: 'My first post',
    description: 'Post title'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'This is the content of my post',
    description: 'Post content'
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Legacy image URL field'
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    type: [FileDto],
    description: 'Array of uploaded image files'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  images?: FileDto[];
}