import { IsArray, IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActorDto {
  @IsString()
  name: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @IsOptional()
  @IsArray()
  @IsInt({each: true})
  movieIds?: number[];
}
