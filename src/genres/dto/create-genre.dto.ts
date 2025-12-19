import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsInt({each: true})
  movieIds?: number[];
}
