import { IsArray, IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActorDto {
  @ApiProperty({
    description: 'Full name of the actor',
    example: 'John Smith',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Date of birth of the actor',
    example: '1964-09-02',
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiPropertyOptional({
    description: 'Array of movie IDs the actor has appeared in',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  movieIds?: number[];
}
