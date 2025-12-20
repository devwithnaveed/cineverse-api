import { ArrayNotEmpty, IsArray, IsDate, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
    example: 'The Matrix',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Brief description or synopsis of the movie',
    example: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Release date of the movie',
    example: '1999-03-31',
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  releaseDate: Date;

  @ApiPropertyOptional({
    description: 'URL or path to the movie poster image',
    example: '/uploads/posters/matrix-poster.jpg',
  })
  @IsOptional()
  @IsString()
  poster?: string;

  @ApiPropertyOptional({
    description: 'URL to the movie trailer',
    example: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
  })
  @IsOptional()
  @IsUrl()
  trailer?: string;

  @ApiProperty({
    description: 'Array of actor IDs associated with the movie',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  actorIds: number[];

  @ApiProperty({
    description: 'Array of genre IDs associated with the movie',
    example: [1, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  genreIds: number[];
}
