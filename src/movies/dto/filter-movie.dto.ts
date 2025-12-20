import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMovieDto {
  @ApiPropertyOptional({
    description: 'Search by movie title (partial match)',
    example: 'Matrix',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by genre ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  genreId?: number;

  @ApiPropertyOptional({
    description: 'Filter by actor ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  actorId?: number;

  @ApiPropertyOptional({
    description: 'Filter by minimum average rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
