import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
    example: 'The Matrix',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Brief description or synopsis of the movie',
    example: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
  })
  @IsString()
  @IsNotEmpty()
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
    description: 'Poster image (uploaded via multipart/form-data)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  poster?: string;

  @ApiPropertyOptional({
    description: 'Trailer video (uploaded via multipart/form-data)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  trailer?: string;

  @ApiProperty({
    description: 'Comma-separated actor IDs or array of actor IDs',
    example: '1,2,3',
  })
  @IsNotEmpty()
  actorIds: string | number[];

  @ApiProperty({
    description: 'Comma-separated genre IDs or array of genre IDs',
    example: '1,2',
  })
  @IsNotEmpty()
  genreIds: string | number[];
}
