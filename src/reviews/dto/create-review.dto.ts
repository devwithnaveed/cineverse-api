import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateReviewDto {
  // 1–5 stars
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment?: string;

  @IsInt()
  movieId: number;
}
