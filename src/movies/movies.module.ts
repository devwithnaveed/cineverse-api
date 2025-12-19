import { forwardRef, Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { GenresModule } from '../genres/genres.module';
import { ActorsModule } from '../actors/actors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    forwardRef(() => GenresModule),
    forwardRef(() => ActorsModule),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
