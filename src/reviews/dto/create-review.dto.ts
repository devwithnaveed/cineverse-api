import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional comment about the movie',
    example: 'Great movie with amazing special effects!',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment?: string;

  @ApiProperty({
    description: 'ID of the movie being reviewed',
    example: 1,
  })
  @IsInt()
  movieId: number;
}
