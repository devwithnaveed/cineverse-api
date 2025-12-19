import { ArrayNotEmpty, IsArray, IsDate, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {

  @IsString()
  title: string;
  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  releaseDate: Date;

  @IsOptional()
  @IsString()
  poster?: string;

  @IsOptional()
  @IsUrl()
  trailer?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({each: true})
  actorIds: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({each: true})
  genreIds: number[];

}
