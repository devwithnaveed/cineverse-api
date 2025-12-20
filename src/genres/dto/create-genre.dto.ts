import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({
    description: 'Name of the genre',
    example: 'Science Fiction',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the genre',
    example: 'A genre dealing with futuristic concepts such as advanced science, technology, space exploration, etc.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Array of movie IDs to associate with this genre',
    example: [1, 2, 5],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  movieIds?: number[];
}
